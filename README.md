# Time Selection Form

React + Vite frontend with a PostgreSQL-backed API for concurrent-safe submissions.

## Full Vercel Deployment

This project is configured for a full Vercel deployment:
- Frontend: Vite static output
- Backend API: Vercel Serverless Functions in `api/`

### Required Vercel Environment Variables

- `DATABASE_URL`
- `TOTAL_POOL_HOURS` (example: `10000000`)
- `DB_SSL` (use `true`)
- `DB_SSL_REJECT_UNAUTHORIZED` (use `true` in production; set `false` only if your network injects self-signed certs)
- `SCHEMA_AUTO_INIT` (recommended `false` in production for lower latency)

### Vercel Project Settings

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### API Endpoints

- `GET /api/health`
- `POST /api/submissions`

No separate backend host is required when deployed on Vercel.

## What It Supports

- No sign-in required
- Any user can submit any number of times
- Stores selected time options and total requested minutes
- Stores IP address (when available) and device metadata
- Maintains a shared total hour pool and deducts atomically per submission
- Handles concurrent submissions safely using DB transactions and row locking

## Environment

Create a `.env` file (or copy from `.env.example`) with:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/geetha
PORT=8787
TOTAL_POOL_HOURS=10000000
```

`TOTAL_POOL_HOURS=10000000` corresponds to 1 crore hours.

## Run Locally

1. Install dependencies:

```
npm install
```

2. Start frontend-only runtime:

```
npm run dev
```

3. Start full-stack local runtime (frontend + Vercel API):

```
npm run dev:full
```

If you use frontend-only mode, set `VITE_API_BASE_URL` to a deployed API domain.
