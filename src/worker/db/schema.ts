// Tables from docs/data-model.md. snake_case columns, camelCase keys.
// Change this file → `npm run db:generate` → a new SQL file in migrations/.
import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { accountIcons } from '../../shared/schemas/account.ts'
import { colors } from '../../shared/schemas/common.ts'

export const accounts = sqliteTable(
  'accounts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    openingBalance: integer('opening_balance').notNull().default(0), // can be negative (money owed)
    color: text('color', { enum: colors }).notNull(),
    icon: text('icon', { enum: accountIcons }).notNull().default('wallet'),
    sortOrder: integer('sort_order').notNull().default(0),
    archived: integer('archived', { mode: 'boolean' }).notNull().default(false),
  },
  // NOCASE: "bkash" and "bKash" are the same account (CSV import matches names this way too)
  (t) => [uniqueIndex('accounts_name_unique').on(sql`${t.name} COLLATE NOCASE`)],
)

export const categories = sqliteTable(
  'categories',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    kind: text('kind', { enum: ['expense', 'income'] }).notNull(),
    color: text('color', { enum: colors }).notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    archived: integer('archived', { mode: 'boolean' }).notNull().default(false),
  },
  (t) => [
    uniqueIndex('categories_name_unique').on(sql`${t.name} COLLATE NOCASE`),
    check('categories_kind_check', sql`${t.kind} IN ('expense', 'income')`),
  ],
)

export const transactions = sqliteTable(
  'transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: text('date').notNull(), // Dhaka local "YYYY-MM-DD"
    type: text('type', { enum: ['income', 'expense', 'transfer'] }).notNull(),
    amount: integer('amount').notNull(), // whole taka, always > 0
    accountId: integer('account_id').notNull().references(() => accounts.id),
    toAccountId: integer('to_account_id').references(() => accounts.id), // transfer only
    categoryId: integer('category_id').references(() => categories.id), // null for transfer
    note: text('note'),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`), // UTC; only orders entries within a day
  },
  (t) => [
    index('transactions_date_idx').on(t.date),
    index('transactions_account_idx').on(t.accountId),
    index('transactions_to_account_idx').on(t.toAccountId),
    index('transactions_category_idx').on(t.categoryId),
    // Safety net under the Zod rules (docs/data-model.md → Rules). Category kind vs type is checked in the API.
    check('transactions_amount_check', sql`${t.amount} > 0`),
    check('transactions_type_check', sql`${t.type} IN ('income', 'expense', 'transfer')`),
    check(
      'transactions_shape_check',
      sql`(${t.type} = 'transfer' AND ${t.toAccountId} IS NOT NULL AND ${t.toAccountId} <> ${t.accountId} AND ${t.categoryId} IS NULL)
       OR (${t.type} <> 'transfer' AND ${t.toAccountId} IS NULL AND ${t.categoryId} IS NOT NULL)`,
    ),
  ],
)
