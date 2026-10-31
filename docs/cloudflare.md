# Cloudflare Setup Guide

Everything here uses Cloudflare's free plan. No card or domain is needed. The app runs at `https://shompod.<your-subdomain>.workers.dev`.

> Cloudflare's tooling changes often. Check the current docs before running these steps:
> - Workers + React (Vite plugin): https://developers.cloudflare.com/workers/vite-plugin/
> - D1: https://developers.cloudflare.com/d1/
> - Access: https://developers.cloudflare.com/cloudflare-one/

## What each piece does

| Piece | What it is |
|---|---|
| **Worker** | Runs the API and serves the React app. Free: 100k requests/day. |
| **D1** | The SQLite database. Free: 5 GB. |
| **Wrangler** | The command-line tool to run locally, migrate, and deploy. Installed as a project dev dependency. |
| **Access** | The login wall in front of the app. You sign in with a one-time code sent to your email. Free for up to 50 users. |

## One-time setup (Phase 2)

1. **Create an account** at https://dash.cloudflare.com/sign-up.
2. **Log in from the terminal** (this opens the browser):
   ```bash
   npx wrangler login
   ```
3. **Create the database:**
   ```bash
   npx wrangler d1 create shompod-db
   ```
   Copy the `database_id` it prints into `wrangler.jsonc` under `d1_databases` (binding `DB`). Local dev doesn't need it: without an ID, `npm run dev` uses a local copy in `.wrangler/state`.
4. **Pick your workers.dev subdomain.** In the dashboard, go to Workers & Pages. Cloudflare asks for it on first use.

## Daily commands

```bash
npm run dev                 # app + API on your laptop, local copy of D1
npm run db:generate         # after changing src/worker/db/schema.ts
npm run db:migrate:local    # apply migrations to the local DB
npm run db:migrate:remote   # apply migrations to the real DB
npm run db:sample:local     # local only: replace transactions with 6 months of fake ones
npm run deploy              # build and ship
```

Order when shipping a schema change: `db:generate` → `db:migrate:remote` → `deploy`.

First time on a new machine: `npm run db:migrate:local` (creates the tables and the seed rows), then optionally `npm run db:sample:local`.

## Login wall with Access (Phase 3)

1. In the dashboard, open **Zero Trust**. The first time, pick a team name and the **Free** plan. It may ask for a card for verification, but the Free plan is not charged.
2. Go to **Access → Applications → Add an application → Self-hosted**.
3. Set the application domain to `shompod.<your-subdomain>.workers.dev`.
4. Add a policy: Action **Allow**, Include **Emails** → your email. (Later, add your wife's email here.)
5. Under login methods, keep **One-time PIN**.
6. Save, then open the app URL. You should see the Cloudflare sign-in page.

Every request then carries a `Cf-Access-Jwt-Assertion` header, and the Worker rejects requests without it in production.

## Backups

D1 has Time Travel (point-in-time restore for the last 7 days on Free). For your own copy, use the app's CSV export now and then.

## If Cloudflare ever stops fitting

Plan B is Vercel + Neon (Postgres). Drizzle supports both, so most of the service code carries over. The schema file has to be rewritten for Postgres, and the Worker entry and database driver change. See `decisions/0001-cloudflare.md`.
