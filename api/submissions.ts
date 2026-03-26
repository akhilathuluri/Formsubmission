import { z } from "zod";
import type { PoolClient } from "pg";
import { maybeAutoInitSchema, totalPoolMinutes } from "./_lib/state";
import { getPool } from "./_lib/db";

const submissionSchema = z.object({
  selectedOptionIds: z.array(z.string().min(1)).min(1),
  requestedMinutes: z.number().int().positive(),
  deviceData: z.record(z.any()).optional(),
});

const getClientIp = (req: any): string | null => {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() || null;
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0]?.split(",")[0]?.trim() || null;
  }
  return req.socket?.remoteAddress || null;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).send("Invalid request payload");
  }

  const { selectedOptionIds, requestedMinutes, deviceData } = parsed.data;
  const userAgent = req.headers?.["user-agent"] ?? null;
  const ipAddress = getClientIp(req);

  let client: PoolClient | null = null;

  try {
    const pool = getPool();
    client = await pool.connect();
    await maybeAutoInitSchema();
    await client.query("BEGIN");

    await client.query(
      `
        INSERT INTO app_state (id, total_minutes, remaining_minutes)
        VALUES (1, $1, $1)
        ON CONFLICT (id) DO NOTHING
      `,
      [totalPoolMinutes],
    );

    const stateResult = await client.query<{ remaining_minutes: string }>(
      "SELECT remaining_minutes FROM app_state WHERE id = 1 FOR UPDATE",
    );

    const currentRemaining = Number(stateResult.rows[0]?.remaining_minutes ?? 0);
    const deductedMinutes = Math.min(requestedMinutes, Math.max(0, currentRemaining));
    const nextRemaining = Math.max(0, currentRemaining - deductedMinutes);

    await client.query(
      "UPDATE app_state SET remaining_minutes = $1, updated_at = NOW() WHERE id = 1",
      [nextRemaining],
    );

    const insertResult = await client.query<{ id: string }>(
      `
        INSERT INTO form_submissions (
          selected_option_ids,
          requested_minutes,
          deducted_minutes,
          remaining_minutes_after,
          ip_address,
          user_agent,
          device_data
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
      [
        selectedOptionIds,
        requestedMinutes,
        deductedMinutes,
        nextRemaining,
        ipAddress,
        userAgent,
        deviceData ? JSON.stringify(deviceData) : null,
      ],
    );

    await client.query("COMMIT");

    return res.status(201).json({
      submissionId: Number(insertResult.rows[0].id),
      deductedMinutes,
      remainingMinutes: nextRemaining,
    });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }
    console.error("Submission transaction failed:", error);

    if (error instanceof Error && /DATABASE_URL is required/i.test(error.message)) {
      return res.status(500).send("Server database is not configured. Set DATABASE_URL in Vercel environment variables.");
    }

    if (error instanceof Error && /relation .* does not exist/i.test(error.message)) {
      return res
        .status(500)
        .send("Database schema not initialized. Run initialization SQL once or set SCHEMA_AUTO_INIT=true temporarily.");
    }

    return res.status(500).send("Could not save submission");
  } finally {
    if (client) {
      try {
        client.release();
      } catch (releaseError) {
        console.error("Client release failed:", releaseError);
      }
    }
  }
}
