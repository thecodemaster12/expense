# Shompod — Expense Tracker

Personal expense tracker that replaces a Google Sheet for logging salary, spending, and money moved between Bank, Cash and bKash. It's a PWA, fast on a phone. Single user for now; multi-user comes later.

Currency: Bangladeshi Taka (৳). Timezone: Asia/Dhaka (UTC+6).

## Where things are

| File | What |
|---|---|
| `plan.md` | Phases and checklists. **Start here.** |
| `docs/architecture.md` | Stack, folder layout, data flow, import rules |
| `docs/data-model.md` | Tables, transaction rules, balance and summary math |
| `docs/api.md` | Endpoints, paging, CSV import |
| `docs/design-system.md` | Colors, type, components, screen references |
| `docs/cloudflare.md` | Hosting setup and daily commands |
| `docs/decisions/` | Why we chose things (ADRs) |
| `designmd/`, `temp-layouts/` | Original design sources (reference only) |

## Goals

1. Log a spend in about 3 taps: amount → category → account → save.
2. See where the money went each month: income, spent, saved, savings %, per category.
3. Know the live balance of every account.
4. Run entirely on free tiers, with nothing that sleeps when idle.

Non-goals: SaaS/sign-up, bank or bKash API sync, native app.

## Working rules

- **Plan first.** Show the plan for a step and wait for "go" before writing code.
- **Never run a git command without permission.** Show the exact command and wait for a yes. Ask before every decision, too.
- Keep replies short and simple.
- One commit per checklist item in `plan.md`, with a clear message. Tick the box.
- Before scaffolding or touching Cloudflare config, check the current Cloudflare docs. Don't use Pages Functions.
- If a decision changes, update the matching doc or add an ADR in `docs/decisions/`.

## Code rules

- TypeScript strict, no `any`.
- Feature folders (`src/client/features/*`, `src/worker/features/*`). A feature never imports another feature.
- Screens get data **only** through `src/client/lib/api.ts`. Only that file calls `fetch`.
- Zod schemas live in `src/shared`, and types are inferred from them. Validate every API input, and return `400` with field errors.
- Worker: `*.route.ts` = HTTP + validation, `*.service.ts` = SQL. Aggregate in SQL (`SUM`, `GROUP BY`) and never sum rows in JS.
- Money is integer taka. Display only via `formatTaka()` → `৳12,500`.
- Dates are `YYYY-MM-DD` Dhaka local strings. Never build "today" from UTC.
- Transfers are never income or spending.
- No query on `transactions` without a date range. Never poll.
- Components stay small and are colocated with their feature. Shared UI goes in `src/client/ui`.
- Style only with the design tokens. No raw hex values in components.
- Vitest tests are required for the balance formula, the summary math, the transfer rules, and the CSV parser.

## Security

- Never commit secrets. Local secrets go in `.dev.vars` and production secrets in `wrangler secret put`. Both are gitignored or kept off-repo.
- Never commit real money data. CSV exports are gitignored, and fixtures use fake numbers.
- The D1 `database_id` in `wrangler.jsonc` is not a secret. Access protects the data.
- Before every push, check `git diff --cached` for keys or tokens.

## Commands

```bash
npm run dev          # app + API locally (http://localhost:5173, API at /api/*)
npm run build        # type-check + production build
npm test             # Vitest
npm run lint
npm run cf-typegen   # regenerate worker-configuration.d.ts (also runs on npm install)
npm run deploy       # build + wrangler deploy (Phase 2)
```

DB scripts (`db:generate`, `db:migrate:local`, `db:migrate:remote`) are added in Phase 2.

## Definition of done

- Works at 360px and on desktop, with a 16px side gutter on mobile.
- Validation errors are shown inline.
- Numbers match the same data in the Google Sheet.
- No full table scans on `transactions`.
