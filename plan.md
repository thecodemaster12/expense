# Shompod — Build Plan

Personal expense tracker. See `CLAUDE.md` for rules and `docs/` for architecture.

Workflow: plan each step → get a "go" → build → commit. One commit per checklist item.

---

## Phase 1: UI with dummy data

Goal: every screen working in the browser, on phone and desktop, with no backend.
Screens get data **only** through `src/client/lib/api.ts`, which returns dummy data for now.

- [x] Scaffold React + Vite + TypeScript (strict) + Tailwind, using the current Cloudflare React template (check docs first)
- [x] Design tokens in Tailwind from `docs/design-system.md` (colors, fonts, radii)
- [x] Shared Zod schemas in `src/shared` (account, category, transaction, summary) + `formatTaka()` + Dhaka date helpers, with tests
- [x] Dummy data fixtures + `api.ts` returning them (shaped by the Zod types)
- [x] App shell: bottom tab bar (mobile), sidebar (desktop), floating "+" button
- [x] Add screen: type toggle, amount, category chips, account chips, date, note, transfer mode, Undo toast
- [x] Transactions screen: grouped by day, filters, edit, delete with confirm, "Load more"
- [x] Dashboard: month picker, 4 cards, category donut + list, account balances, 6-month bar chart
- [x] Accounts screen: total, balances, opening balances, add/edit/archive/restore, colors
- [x] Profile placeholder: top-right avatar menu with name, email, disabled Sign out
- [x] Settings screen: category manager (add, rename, delete that moves entries into another existing category), import/export buttons (UI only), app version
- [ ] Check every screen at 360px and desktop

## Phase 2: Backend

Goal: real data, deployed to `shompod.<you>.workers.dev`.

- [ ] Cloudflare account + `wrangler login` + create D1 (`docs/cloudflare.md`)
- [ ] Hono Worker serving `/api/*` and the built SPA
- [ ] Drizzle schema, first migration, seed script
- [ ] Transactions API (CRUD, filters, paging) with Zod validation + tests for transfer rules
- [ ] Accounts + categories API, balance in SQL + tests for the balance formula
- [ ] Summary APIs (`/summary`, `/summary/months`) in SQL + tests for summary math
- [ ] Switch `api.ts` from dummy data to real API (no screen changes)
- [ ] First deploy with remote D1

## Phase 3: Daily use

- [ ] Cloudflare Access login wall (dashboard steps in `docs/cloudflare.md`) + header check in Worker
- [ ] Real profile: `GET /api/me` reads the Access email; Sign out goes to `/cdn-cgi/access/logout`
- [ ] PWA: manifest, icons, install, offline shell
- [ ] CSV import with preview (parser tests) and CSV export
- [ ] Dark mode from the same tokens

## Phase 4: Later

- [ ] Multi-user: `created_by` from the Access email
- [ ] Monthly budget per category, warning at 80%
- [ ] Recurring entries (rent on the 1st)
- [ ] Weekly cash count / reconcile (from the Stitch design)
- [ ] Search, batch entry
- [ ] Year view, month-over-month comparison
- [ ] Offline queue for adding entries without network
