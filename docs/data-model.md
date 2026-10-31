# Data Model

## Money and dates

- Money is **integer taka**. No decimals, no floats. Display only through `formatTaka()` → `৳1,15,000` (lakh grouping).
- Columns are snake_case in the database. Code and the API use camelCase (`accountId`), and Drizzle maps between them.
- Dates are `YYYY-MM-DD` text in **Asia/Dhaka** local date. Never build "today" from UTC.
- Month = `substr(date, 1, 7)`.
- No time of day. `created_at` keeps the order of entries within a day.

## Tables

```ts
// accounts
id               integer pk
name             text unique nocase not null // "Bank", "Cash", "bKash"
opening_balance  integer not null default 0     // can be negative (money owed)
color            text not null               // palette name, e.g. "slate"
icon             text not null default 'wallet' // bank | wallet | mobile | card | savings | cash | coins | work | home | safe
sort_order       integer not null default 0
archived         integer not null default 0  // boolean

// categories
id          integer pk
name        text unique nocase not null      // "Food"
kind        text not null                    // "expense" | "income"
color       text not null                    // palette name, e.g. "amber" (docs/design-system.md)
sort_order  integer not null default 0
archived    integer not null default 0

// transactions
id             integer pk
date           text not null                 // "2026-11-03"
type           text not null                 // "income" | "expense" | "transfer"
amount         integer not null              // > 0, always positive
account_id     integer not null references accounts(id)
to_account_id  integer references accounts(id)   // transfer only
category_id    integer references categories(id) // null for transfer
note           text
created_at     text not null default current_timestamp

index on (date), index on (account_id), index on (to_account_id), index on (category_id)
```

Later (Phase 4): `created_by text` on transactions, from the Access email.

## Rules

Enforced in the shared Zod schema and again in the API. The database repeats the simple ones as CHECK rules (amount, type, transfer shape), so a bug can't store a bad row. Names are unique ignoring case.

- `amount > 0`.
- `expense`: `category_id` is an expense category; `to_account_id` is null.
- `income`: `category_id` is an income category; `to_account_id` is null.
- `transfer`: `to_account_id` is required and differs from `account_id`; `category_id` is null.
- **Transfers are never income or spending.** They only move money between accounts.

## Deleting a category

Entries never lose their category. Before a used category is deleted, its entries move (merge) into another existing category of the same kind. The move and the delete run in one D1 batch. The last category of a kind can't be deleted.

- Want a new name instead? That's Rename, not delete.
- There's no "delete its entries too" option: it would silently change past months' totals and account balances.

## Balance

```
balance(account) = opening_balance
                 + SUM(income   where account_id    = account)
                 + SUM(transfer where to_account_id = account)
                 - SUM(expense  where account_id    = account)
                 - SUM(transfer where account_id    = account)
```

Computed in SQL, never by loading rows into the Worker.

## Monthly summary

```
income      = SUM(amount) where type = income  and month = M
spent       = SUM(amount) where type = expense and month = M
saved       = income - spent
savingsRate = income > 0 ? saved / income : 0
byCategory  = spent grouped by category, share = amount / spent
```

## Seed data

- Accounts: Bank, Cash, bKash (opening balance 0).
- An account is never deleted, only archived: it disappears from the Add pickers, but its history and balance stay (and count toward the total). At least one account stays active.
- Expense categories: Rent, Food, Electricity & Bills, Travel, Shopping, Health, Family, Other.
- Income categories: Salary, Other Income.
- Seed colors are listed in `docs/design-system.md`.
- The seed lives in `migrations/0001_seed.sql`, so it runs once on each database.

## Must-test logic

These must never be wrong, so each one has Vitest tests: the balance formula, the summary math, the transfer rules, and the CSV parser.
