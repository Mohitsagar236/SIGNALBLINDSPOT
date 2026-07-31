# Architecture

The app uses Next.js App Router with server actions for credential auth and product mutations. Prisma models define durable PostgreSQL storage. Product logic is separated into pure TypeScript modules so it can be tested without the database.

Key layers:

- UI routes: `app/`
- Components: `components/`
- Domain logic: `lib/scoring.ts`
- CSV validation: `lib/csv.ts`
- Synthetic demo generator: `lib/demo-data.ts`
- Data model and seed: `prisma/`
