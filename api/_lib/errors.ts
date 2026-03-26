type ErrorLike = {
  message?: string;
  code?: string;
  errno?: string;
};

export const getDatabaseErrorMessage = (error: unknown): string | null => {
  if (!(error instanceof Error)) {
    return null;
  }

  const err = error as Error & ErrorLike;
  const message = err.message || "";
  const code = err.code || err.errno || "";

  if (/DATABASE_URL is required/i.test(message)) {
    return "Server database is not configured. Set DATABASE_URL in Vercel environment variables.";
  }

  if (/relation .* does not exist/i.test(message) || code === "42P01") {
    return "Database schema not initialized. Set SCHEMA_AUTO_INIT=true for one deploy or run the schema SQL manually.";
  }

  if (code === "28P01") {
    return "Database authentication failed. Verify DATABASE_URL username and password.";
  }

  if (code === "3D000") {
    return "Database name is invalid or missing. Verify DATABASE_URL database name.";
  }

  if (code === "ECONNREFUSED") {
    return "Database connection was refused. Verify host, port, firewall, and allowlist settings.";
  }

  if (code === "ENOTFOUND") {
    return "Database host was not found. Verify DATABASE_URL host value.";
  }

  if (/self signed certificate|certificate/i.test(message)) {
    return "TLS certificate validation failed. Check DB_SSL and DB_SSL_REJECT_UNAUTHORIZED settings.";
  }

  return null;
};
