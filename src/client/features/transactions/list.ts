// Pure helpers for the Transactions list (tested in list.test.ts).
import { formatTaka } from '../../../shared/money.ts'
import type { Account } from '../../../shared/schemas/account.ts'
import type { Category } from '../../../shared/schemas/category.ts'
import { transactionQuery, type Transaction, type TransactionQuery } from '../../../shared/schemas/transaction.ts'

export type DayGroup = { date: string; spent: number; items: Transaction[] }

/** Items arrive newest first; consecutive same-day rows form one group. Transfers never count as spent. */
export function groupByDay(items: Transaction[]): DayGroup[] {
  const groups: DayGroup[] = []
  for (const t of items) {
    let group = groups.at(-1)
    if (group?.date !== t.date) {
      group = { date: t.date, spent: 0, items: [] }
      groups.push(group)
    }
    group.items.push(t)
    if (t.type === 'expense') group.spent += t.amount
  }
  return groups
}

/** "৳450 · Food" or "৳5,000 · Bank → bKash" for toasts and confirm dialogs. */
export function describe(t: Transaction, accounts: Account[] = [], categories: Category[] = []) {
  const name = (list: { id: number; name: string }[], id: number | null) => list.find((x) => x.id === id)?.name ?? '?'
  const label =
    t.type === 'transfer' ? `${name(accounts, t.accountId)} → ${name(accounts, t.toAccountId)}` : name(categories, t.categoryId)
  return `${formatTaka(t.amount)} · ${label}`
}

/** URL ?month=&account=&category=&type= → query. Anything invalid falls back to just the current month. */
export function readFilters(params: URLSearchParams, currentMonth: string): TransactionQuery {
  const parsed = transactionQuery.safeParse({
    month: params.get('month') ?? currentMonth,
    accountId: params.get('account') ?? undefined,
    categoryId: params.get('category') ?? undefined,
    type: params.get('type') ?? undefined,
  })
  return parsed.success ? parsed.data : { month: currentMonth }
}

export function writeFilters(q: TransactionQuery): URLSearchParams {
  const params = new URLSearchParams({ month: q.month })
  if (q.accountId) params.set('account', String(q.accountId))
  if (q.categoryId) params.set('category', String(q.categoryId))
  if (q.type) params.set('type', q.type)
  return params
}
