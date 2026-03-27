import { maybeAutoInitSchema, totalPoolMinutes } from "./_lib/state.js";
import { getPool } from "./_lib/db.js";
import { getDatabaseErrorMessage } from "./_lib/errors.js";

type SubmissionRow = {
  id: string;
  selected_option_ids: string[];
  requested_minutes: number;
  deducted_minutes: number;
  remaining_minutes_after: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const pool = getPool();
    await maybeAutoInitSchema();

    const stateResult = await pool.query<{ total_minutes: string; remaining_minutes: string }>(
      "SELECT total_minutes, remaining_minutes FROM app_state WHERE id = 1",
    );

    const submissionsResult = await pool.query<SubmissionRow>(`
      SELECT
        id,
        selected_option_ids,
        requested_minutes,
        deducted_minutes,
        remaining_minutes_after,
        ip_address::text AS ip_address,
        user_agent,
        created_at
      FROM form_submissions
      ORDER BY created_at DESC
    `);

    const totalMinutes = Number(stateResult.rows[0]?.total_minutes ?? totalPoolMinutes);
    const remainingMinutes = Number(stateResult.rows[0]?.remaining_minutes ?? totalPoolMinutes);

    return res.status(200).json({
      totalMinutes,
      remainingMinutes,
      submissions: submissionsResult.rows.map((row) => ({
        id: Number(row.id),
        selectedOptionIds: row.selected_option_ids,
        requestedMinutes: Number(row.requested_minutes),
        deductedMinutes: Number(row.deducted_minutes),
        remainingMinutesAfter: Number(row.remaining_minutes_after),
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error("Geetha route failed:", error);

    const dbErrorMessage = getDatabaseErrorMessage(error);
    if (dbErrorMessage) {
      return res.status(500).json({ error: dbErrorMessage });
    }

    return res.status(500).json({ error: "Could not load Geetha dashboard" });
  }
}
