# 0002 — Feature-based folders

**Status:** accepted, 2026-10-30

## Context

Grouping files by layer (`components/`, `routes/`, `hooks/`) spreads one feature across many folders and gets messy as the app grows.

## Decision

Group by feature on both sides:
- Client: `src/client/features/<name>/` holds that feature's page, components and hooks. Shared UI goes in `src/client/ui/`.
- Worker: `src/worker/features/<name>/` has `<name>.route.ts` (HTTP + Zod validation) and `<name>.service.ts` (SQL). There are no other layers.
- A feature never imports from another feature. Anything shared moves to `ui/`, `lib/` or `shared/`.

## Consequences

- Adding a feature means adding one folder. Deleting a feature means deleting one folder.
- The import rules are listed in `docs/architecture.md`.
