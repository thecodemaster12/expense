# 0001 — Host everything on Cloudflare

**Status:** accepted, 2026-10-30

## Context

The app needs free hosting, a real SQL database, and a login wall, and nothing may pause when idle.

## Options

| Option | Problem |
|---|---|
| Vercel + Supabase | Free projects pause after about 1 week idle |
| Vercel + Neon | DB sleeps (about 1s wake-up); you have to build login yourself |
| Firebase | NoSQL makes monthly SQL-style totals awkward |
| **Cloudflare Workers + D1 + Access** | New tooling to learn |

## Decision

Cloudflare: one Worker for the app and API, D1 for data, Access for login. It's free, never sleeps, and needs no login code.

## Consequences

- We learn Wrangler (dev, migrate, deploy). Steps are in `docs/cloudflare.md`.
- We stay within the free limits: aggregate in SQL, index the date columns, never poll.
- Exit path: Vercel + Neon. Drizzle keeps the service code mostly portable, but the schema file needs a Postgres rewrite.
