# Kholoud Khaled Makeup Artist Website

Modern Next.js website generated from the public Facebook page signals for Kholoud Khaled Makeup Artist in Giza.

## Local Setup

```bash
npm install
npm run db:init
npm run build
npm run start
```

Admin login defaults are in `.env`:

```txt
admin@kholoudmakeup.com
admin12345
```

Change `ADMIN_PASSWORD` and `AUTH_SECRET` before production.

## Verification

```bash
npm run test:smoke
npm run test:visual
```

The smoke test checks public pages, booking submission, admin login, and dashboard data. The visual test saves screenshots to `test-results`.

## Vercel Notes

This project is Vercel-ready for build/deployment, but file-based SQLite is not durable on serverless infrastructure. For real production booking persistence on Vercel, keep the Prisma models and switch `DATABASE_URL` to a persistent SQLite-compatible provider or hosted relational database.
