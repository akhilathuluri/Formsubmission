import { maybeAutoInitSchema, totalPoolMinutes } from "./_lib/state";
import { getPool } from "./_lib/db";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const pool = getPool();
    await maybeAutoInitSchema();
    const state = await pool.query(
      "SELECT total_minutes, remaining_minutes, updated_at FROM app_state WHERE id = 1",
    );

    return res.status(200).json({
      ok: true,
      totalMinutes: state.rows[0]?.total_minutes ?? totalPoolMinutes,
      remainingMinutes: state.rows[0]?.remaining_minutes ?? totalPoolMinutes,
      updatedAt: state.rows[0]?.updated_at ?? null,
    });
  } catch (error) {
    console.error("Health check failed:", error);

    if (error instanceof Error && /DATABASE_URL is required/i.test(error.message)) {
      return res.status(500).json({ error: "Server database is not configured. Set DATABASE_URL in Vercel environment variables." });
    }

    return res.status(500).json({ error: "Could not read health state" });
  }
}
