# API

All routes are JSON under `/api`. Every input is validated with the shared Zod schemas. When validation fails, the API returns `400` with field errors:

```json
{ "error": "validation", "fields": { "amount": "Must be greater than 0" } }
```

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/accounts` | List accounts with computed `balance` |
| POST | `/api/accounts` | Create account. Gets the next unused `color` unless one is given. |
| PATCH | `/api/accounts/:id` | Rename, change opening balance, archive. Only the fields sent change. |
| GET | `/api/categories` | List categories, each with `uses` (transactions in the last 90 days) for most-used-first chips |
| POST | `/api/categories` | Create category. Goes to the end of its list unless `sortOrder` is given, and gets the next unused `color` unless one is given. |
| PATCH | `/api/categories/:id` | Rename, recolor, reorder, archive. Only the fields sent change. |
| GET | `/api/categories/:id/usage` | `{ count }`: all-time number of entries using it (shown before deleting) |
| DELETE | `/api/categories/:id?moveTo=ID` | Delete. If entries use it, `moveTo` (another category of the same kind) is required and they move there in the same batch. The last category of a kind can't be deleted. |
| GET | `/api/transactions` | Filtered list, newest first, paged |
| GET | `/api/transactions/:id` | One transaction (for the edit screen) |
| POST | `/api/transactions` | Create |
| PATCH | `/api/transactions/:id` | Update (send the whole transaction, same schema as create) |
| DELETE | `/api/transactions/:id` | Delete |
| GET | `/api/summary?month=YYYY-MM` | `{ income, spent, saved, savingsRate, byCategory: [{ category, amount, share }] }` |
| GET | `/api/summary/months?from=YYYY-MM&to=YYYY-MM` | Per-month `{ month, income, spent, saved }` |
| GET | `/api/export.csv` | Export all transactions |
| POST | `/api/import` | Import Google Sheet CSV (`?dryRun=1` returns a preview) |

## Transactions list and paging

```
GET /api/transactions?month=2026-11&account=&category=&type=&cursor=
```

- `month` is required, so the query always has a date range.
- Returns 50 rows, newest first, ordered by `date DESC, id DESC`.
- Response: `{ items: [...], nextCursor: "2026-11-03_412" | null }`.
- The client shows a "Load more" button while `nextCursor` isn't null.
- The cursor is keyset paging (`(date, id) < (cursorDate, cursorId)`). It stays fast as the data grows.

## CSV import

The sheet's columns, in order: `Date, Type, Category, Amount (৳), Account, To account, Note, Month`

- `Month` is ignored.
- Dates may be `3 Nov 2026` or `2026-11-03`.
- Amount has `৳` and commas stripped.
- Type, category and account are matched by name, case-insensitive. Missing categories and accounts are created.
- With `dryRun`, the API returns the row count and per-row errors. Without it, it inserts everything in one D1 batch.

## Auth

Cloudflare Access protects the whole domain. In production, the Worker rejects any request that lacks the `Cf-Access-Jwt-Assertion` header. In local dev, the check is skipped.
