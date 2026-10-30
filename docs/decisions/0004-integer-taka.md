# 0004 — Money is integer taka

**Status:** accepted, 2026-10-30

## Context

Floats cause rounding errors in money. The Google Sheet uses whole taka only.

## Decision

Store and calculate money as integers in whole taka, with no paisa. Display only through `formatTaka()`, which uses lakh grouping: `৳12,500`, `৳1,15,000`, `৳1,25,00,000`. No `.00`, even though the Stitch screens show it.

## Consequences

- SQL `SUM` stays exact.
- If paisa is ever needed, migrate to integer paisa (×100) in one go. Never switch to floats.
