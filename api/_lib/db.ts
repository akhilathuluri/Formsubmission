import { Pool } from "pg";

const DB_SSL = process.env.DB_SSL !== "false";
const DB_SSL_REJECT_UNAUTHORIZED = process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false";

declare global {
  // eslint-disable-next-line no-var
  var __geethaPool: Pool | undefined;
}

const createPool = (): Pool => {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  return new Pool({
    connectionString: DATABASE_URL,
    ssl: DB_SSL
      ? {
          rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED,
        }
      : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
};

export const getPool = (): Pool => {
  if (!globalThis.__geethaPool) {
    globalThis.__geethaPool = createPool();
  }
  return globalThis.__geethaPool;
};
