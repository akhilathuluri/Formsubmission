import { pool } from "./db";

const defaultTotalHours = Number(process.env.TOTAL_POOL_HOURS || 10_000_000);
export const totalPoolMinutes = Math.max(0, Math.floor(defaultTotalHours * 60));
const shouldAutoInitSchema =
  process.env.SCHEMA_AUTO_INIT === "true" || process.env.VERCEL_ENV !== "production";

declare global {
  // eslint-disable-next-line no-var
  var __geethaSchemaReady: boolean | undefined;
}

export const ensureSchema = async (): Promise<void> => {
  if (globalThis.__geethaSchemaReady) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id SMALLINT PRIMARY KEY DEFAULT 1,
      total_minutes BIGINT NOT NULL,
      remaining_minutes BIGINT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CHECK (id = 1),
      CHECK (total_minutes >= 0),
      CHECK (remaining_minutes >= 0)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id BIGSERIAL PRIMARY KEY,
      selected_option_ids TEXT[] NOT NULL,
      requested_minutes INTEGER NOT NULL CHECK (requested_minutes > 0),
      deducted_minutes INTEGER NOT NULL CHECK (deducted_minutes >= 0),
      remaining_minutes_after BIGINT NOT NULL CHECK (remaining_minutes_after >= 0),
      ip_address INET,
      user_agent TEXT,
      device_data JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at
    ON form_submissions (created_at DESC);
  `);

  await pool.query(
    `
      INSERT INTO app_state (id, total_minutes, remaining_minutes)
      VALUES (1, $1, $1)
      ON CONFLICT (id) DO NOTHING
    `,
    [totalPoolMinutes],
  );

  globalThis.__geethaSchemaReady = true;
};

export const maybeAutoInitSchema = async (): Promise<void> => {
  if (!shouldAutoInitSchema) {
    return;
  }
  await ensureSchema();
};
