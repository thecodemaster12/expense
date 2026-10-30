# Data Model

## Money and dates

- Money is **integer taka**. No decimals, no floats. Display only through `formatTaka()` → `৳12,500`.
- Dates are `YYYY-MM-DD` text in **Asia/Dhaka** local date. Never build "today" from UTC.
- Month = `substr(date, 1, 7)`.
- No time of day. `created_at` keeps the order of entries within a day.

## Tables

```ts
// accounts
id               integer pk
name             text unique not null        // "Bank", "Cash", "bKash"
opening_balance  integer not null default 0
sort_order       integer not null default 0
archived         integer not null default 0  // boolean

// categories
id          integer pk
name        text unique not null             // "Food"
kind        text not null                    // "expense" | "income"
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

index on (date), index on (account_id), index on (to_account_id)
```

Later (Phase 4): `created_by text` on transactions, from the Access email.

## Rules

Enforced in the shared Zod schema and again in the API.

- `amount > 0`.
- `expense`: `category_id` is an expense category; `to_account_id` is null.
- `income`: `category_id` is an income category; `to_account_id` is null.
- `transfer`: `to_account_id` is required and differs from `account_id`; `category_id` is null.
- **Transfers are never income or spending.** They only move money between accounts.

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
- Expense categories: Rent, Food, Electricity & Bills, Travel, Shopping, Health, Family, Other.
- Income categories: Salary, Other Income.

## Must-test logic

These must never be wrong, so each one has Vitest tests: the balance formula, the summary math, the transfer rules, and the CSV parser.
