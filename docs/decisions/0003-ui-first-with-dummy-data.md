# 0003 — Build the UI first with dummy data

**Status:** accepted, 2026-10-30

## Context

We want to see and use the screens before building the backend.

## Decision

Phase 1 builds every screen against dummy data. Screens get data **only** through `src/client/lib/api.ts`, whose functions return fixtures typed by the shared Zod schemas. Phase 2 swaps the bodies of those functions for real `fetch` calls.

## Consequences

- Switching to the real API changes one file, and no screen changes.
- The fixtures must follow the data rules (transfers have no category, amounts are positive integers, and so on). Typing them with the Zod schemas keeps them honest.
- The balance and summary math shown in Phase 1 is fake. The real math lives in SQL and is tested in Phase 2.
