// Local-only sample data: 6 months of made-up entries ending this month, written as SQL for
// `npm run db:sample:local`. Replaces all transactions in the LOCAL database. Never run against --remote.
// Account/category ids match migrations/0001_seed.sql.
import { mkdirSync, writeFileSync } from 'node:fs'
import { monthOf, todayDhaka } from '../src/shared/date.ts'
// shortcut: reuses the Phase 1 fake generator; move it here when src/client/lib/fake/ is deleted (Phase 2, step 6).
import { accounts, generateTransactions } from '../src/client/lib/fake/fixtures.ts'

const text = (v: string | null | undefined) => (v == null ? 'NULL' : `'${v.replaceAll("'", "''")}'`)
const num = (v: number | null) => (v == null ? 'NULL' : String(v))

const rows = generateTransactions(monthOf(todayDhaka())).map(
  (t) =>
    `(${text(t.date)}, ${text(t.type)}, ${t.amount}, ${t.accountId}, ${num(t.toAccountId)}, ${num(t.categoryId)}, ${text(t.note)}, ${text(t.createdAt)})`,
)

const sql = [
  'DELETE FROM transactions;',
  ...accounts.map((a) => `UPDATE accounts SET opening_balance = ${a.openingBalance} WHERE id = ${a.id};`),
  `INSERT INTO transactions (date, type, amount, account_id, to_account_id, category_id, note, created_at) VALUES\n${rows.join(',\n')};`,
].join('\n')

mkdirSync('.wrangler', { recursive: true })
writeFileSync('.wrangler/sample.sql', sql)
console.log(`Wrote ${rows.length} sample transactions to .wrangler/sample.sql`)
