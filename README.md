# SignalBlindspot

Find the user segments your roadmap is ignoring.

SignalBlindspot is a production-grade MVP for Product Managers who need to know whether roadmap decisions are supported by representative evidence or distorted by loud, overrepresented segments.

## Why It Exists

Most feedback tools count, tag, and summarize requests. SignalBlindspot compares linked feedback and interview evidence against the actual user population, then highlights underrepresented segments before prioritization.

## Tech Stack

Next.js, TypeScript, React, Tailwind CSS, Prisma, PostgreSQL, Zod, bcrypt password hashing, Recharts, CSV validation, Vitest, Playwright, Docker.

## Setup

1. Copy `.env.example` to `.env`.
2. Start Postgres with `docker compose up -d`.
3. Install dependencies with `npm.cmd install`.
4. Generate Prisma client with `npm.cmd run db:generate`.
5. Run migration with `npm.cmd run db:migrate`.
6. Seed demo data with `npm.cmd run db:seed`.
7. Start locally with `npm.cmd run dev`.

## Demo Login

- Product Manager: `pm@signalblindspot.dev`
- Admin: `admin@signalblindspot.dev`
- Researcher: `researcher@signalblindspot.dev`
- Password: `SignalBlindspot123!`

## Commands

- `npm.cmd run dev`
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run test:e2e`
- `npm.cmd run build`
- `npm.cmd run demo:reload`

## Main Demo Flow

Open `/dashboard`, then inspect `/roadmap/roadmap-admin-dashboard`. The app shows that Admin Dashboard evidence is dominated by enterprise admins while operators are underrepresented. Open the report page to export the Markdown decision report.

## Deployment Notes

Use managed Postgres in production, set `DATABASE_URL`, run migrations, seed only synthetic/demo workspaces when needed, and use a long random `AUTH_SECRET`.
