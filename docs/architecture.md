# Architecture

## Overview

One Cloudflare Worker serves both the React app (static assets) and the JSON API under `/api/*`. Data lives in Cloudflare D1 (SQLite). Cloudflare Access sits in front of everything as the login wall. All of it is on free tiers and nothing sleeps when idle. See `decisions/0001-cloudflare.md`.

```
Phone / Browser
   │
Cloudflare Access (login wall)
   │
Worker ──► static assets (built React app)
   └────► /api/*  Hono ──► D1 (SQLite)
```

## Data flow

```
Screen component
  → feature hook (TanStack Query)
  → src/client/lib/api.ts          ← the ONLY place that talks to the network
  → /api/<feature>  route          ← validates input with Zod, returns JSON
  → <feature>.service.ts           ← SQL via Drizzle, aggregation in SQL
  → D1
```

In Phase 1, `api.ts` returns dummy data instead of calling the network. Screens don't know the difference. See `decisions/0003-ui-first-with-dummy-data.md`.

## Folder layout

Feature-based on both sides. See `decisions/0002-feature-folders.md`.

```
/
├── CLAUDE.md                  # rules for working in this repo
├── plan.md                    # phases and checklists
├── docs/                      # this folder
├── wrangler.jsonc             # Worker config, D1 binding "DB", static assets
├── drizzle.config.ts
├── migrations/                # generated SQL migrations
├── public/                    # PWA icons, manifest assets
└── src/
    ├── shared/                # used by client AND worker
    │   ├── schemas/           # Zod schemas; types are inferred from them
    │   ├── money.ts           # formatTaka(), parse helpers
    │   └── date.ts            # Dhaka "today", month helpers
    ├── worker/
    │   ├── index.ts           # Hono app, mounts feature routes, auth check
    │   ├── db/schema.ts       # Drizzle schema
    │   └── features/
    │       ├── transactions/  # transactions.route.ts, transactions.service.ts, *.test.ts
    │       ├── accounts/
    │       ├── categories/
    │       ├── summary/
    │       └── io/            # CSV import/export
    └── client/
        ├── main.tsx           # router + query client
        ├── lib/api.ts         # typed fetch wrappers (dummy data in Phase 1)
        ├── lib/fixtures.ts    # dummy data (Phase 1 only)
        ├── ui/                # shared design-system pieces: Button, Chip, Card, Money, Sheet, Toast
        ├── layout/            # AppShell, TabBar, Sidebar, AddButton
        └── features/
            ├── dashboard/     # DashboardPage + its components + hooks
            ├── add/           # AddPage (quick-add form)
            ├── transactions/
            ├── accounts/
            └── settings/
```

## Boundaries (what may import what)

- `shared/` imports nothing from `client/` or `worker/`.
- A `client/features/X` folder may import from `client/ui`, `client/layout`, `client/lib`, and `shared`. It must not import from another feature. If two features need the same thing, move it to `ui/` or `lib/`.
- A `worker/features/X` folder may import from `worker/db` and `shared`. Routes don't contain SQL, and services don't read HTTP requests.
- Only `lib/api.ts` calls `fetch`.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React, Vite, TypeScript (strict) |
| Routing | React Router |
| Styling | Tailwind CSS, tokens from `design-system.md` |
| Data fetching | TanStack Query |
| Charts | Recharts |
| PWA | vite-plugin-pwa |
| API | Hono on Cloudflare Workers |
| Database | Cloudflare D1 + Drizzle ORM / drizzle-kit |
| Validation | Zod (shared) |
| Auth | Cloudflare Access |
| Tests | Vitest |
| Deploy | Wrangler (Cloudflare Vite plugin) |

## Free-tier limits to respect

- Workers: 100k requests/day, 10 ms CPU per request. Keep handlers light.
- D1: 5M rows read/day, 100k rows written/day, 5 GB. Limits reset at 00:00 UTC.
- So: aggregate in SQL, index `transactions(date)`, `(account_id)` and `(to_account_id)`, never poll, and don't query `transactions` without a date range.
