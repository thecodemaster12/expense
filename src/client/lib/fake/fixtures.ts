// Phase 1 only: made-up data (docs/decisions/0003). Deleted in Phase 2 with the rest of lib/fake/.
import { addMonths } from '../../../shared/date.ts'
import type { Account } from '../../../shared/schemas/account.ts'
import type { Category } from '../../../shared/schemas/category.ts'
import type { Transaction, TransactionInput } from '../../../shared/schemas/transaction.ts'

export type StoredAccount = Omit<Account, 'balance'>
export type StoredCategory = Omit<Category, 'uses'>

export const BANK = 1
export const CASH = 2
export const BKASH = 3

export const accounts: StoredAccount[] = [
  { id: BANK, name: 'Bank', openingBalance: 40000, sortOrder: 0, archived: false },
  { id: CASH, name: 'Cash', openingBalance: 3000, sortOrder: 1, archived: false },
  { id: BKASH, name: 'bKash', openingBalance: 2000, sortOrder: 2, archived: false },
]

export const RENT = 1, FOOD = 2, BILLS = 3, TRAVEL = 4, SHOPPING = 5, HEALTH = 6, FAMILY = 7, OTHER = 8
export const SALARY = 9, OTHER_INCOME = 10

const expenseNames = ['Rent', 'Food', 'Electricity & Bills', 'Travel', 'Shopping', 'Health', 'Family', 'Other']
export const categories: StoredCategory[] = [
  ...expenseNames.map((name, i) => ({ id: i + 1, name, kind: 'expense' as const, sortOrder: i, archived: false })),
  { id: SALARY, name: 'Salary', kind: 'income', sortOrder: 0, archived: false },
  { id: OTHER_INCOME, name: 'Other Income', kind: 'income', sortOrder: 1, archived: false },
]

/** Seeded PRNG so the fixtures are the same on every load. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Draft = TransactionInput

export function generateTransactions(lastMonth = '2026-10', months = 6): Transaction[] {
  const rand = mulberry32(42)
  const between = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1))
  const round = (n: number, to: number) => Math.max(to, Math.round(n / to) * to)
  const pick = <T,>(items: T[]) => items[Math.floor(rand() * items.length)]
  const drafts: Draft[] = []

  for (let i = months - 1; i >= 0; i--) {
    const month = addMonths(lastMonth, -i)
    const day = (d: number) => `${month}-${String(d).padStart(2, '0')}`
    const spend = (d: number, amount: number, accountId: number, categoryId: number, note?: string) =>
      drafts.push({ type: 'expense', date: day(d), amount, accountId, categoryId, toAccountId: null, note })

    drafts.push({ type: 'income', date: day(1), amount: 85000, accountId: BANK, categoryId: SALARY, toAccountId: null, note: 'Monthly salary' })
    spend(2, 22000, BANK, RENT, 'Flat rent')
    drafts.push({ type: 'transfer', date: day(3), amount: 15000, accountId: BANK, toAccountId: BKASH, categoryId: null, note: 'Add money' })
    drafts.push({ type: 'transfer', date: day(5), amount: 10000, accountId: BANK, toAccountId: CASH, categoryId: null, note: 'ATM' })
    spend(10, round(between(1800, 2600), 10), BKASH, BILLS, 'DESCO prepaid')

    for (let n = 0; n < 15; n++) spend(between(1, 28), round(between(150, 1500), 10), pick([CASH, BKASH]), FOOD, pick(['Groceries', 'Lunch', 'Bazar', undefined]))
    for (let n = 0; n < 6; n++) spend(between(1, 28), round(between(60, 400), 10), CASH, TRAVEL, pick(['Rickshaw', 'CNG', 'Bus', undefined]))
    for (let n = 0; n < 2; n++) spend(between(1, 28), round(between(800, 4000), 50), pick([BKASH, BANK]), SHOPPING)
    spend(between(1, 28), round(between(300, 2000), 10), CASH, HEALTH, 'Pharmacy')
    spend(between(1, 28), round(between(3000, 6000), 500), BKASH, FAMILY, 'Send home')
    spend(between(1, 28), round(between(100, 800), 10), CASH, OTHER)
    if (rand() < 0.4) {
      drafts.push({ type: 'income', date: day(between(10, 28)), amount: round(between(2000, 8000), 500), accountId: BKASH, categoryId: OTHER_INCOME, toAccountId: null, note: 'Freelance' })
    }
  }

  return drafts
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t, i) => ({ ...t, id: i + 1, createdAt: `${t.date} 09:00:00` }))
}
