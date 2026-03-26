import { maybeAutoInitSchema, totalPoolMinutes } from "./_lib/state.js";
import { getPool } from "./_lib/db.js";
import { getDatabaseErrorMessage } from "./_lib/errors.js";

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

    const dbErrorMessage = getDatabaseErrorMessage(error);
    if (dbErrorMessage) {
      return res.status(500).json({ error: dbErrorMessage });
    }

    return res.status(500).json({ error: "Could not read health state" });
  }
}
