// Pure form logic for TransactionForm (tested in form.test.ts).
import { todayDhaka } from '../../../shared/date.ts'
import { parseTaka } from '../../../shared/money.ts'
import type { Account } from '../../../shared/schemas/account.ts'
import type { Category } from '../../../shared/schemas/category.ts'
import type { Transaction, TransactionType } from '../../../shared/schemas/transaction.ts'

export type FormState = {
  type: TransactionType
  amount: string // digits only, e.g. "115000"
  categoryId: number | null
  accountId: number | null
  toAccountId: number | null
  date: string
  note: string
}

export function newForm(accounts: Account[], lastAccountId: number | null): FormState {
  const active = accounts.filter((a) => !a.archived)
  const accountId = active.find((a) => a.id === lastAccountId)?.id ?? active[0]?.id ?? null
  return { type: 'expense', amount: '', categoryId: null, accountId, toAccountId: null, date: todayDhaka(), note: '' }
}

export function fromTransaction(t: Transaction): FormState {
  const { type, amount, categoryId, accountId, toAccountId, date, note } = t
  return { type, amount: String(amount), categoryId, accountId, toAccountId, date, note: note ?? '' }
}

/** Switching type drops whatever no longer fits: the category (wrong kind or transfer) and the to-account. */
export function changeType(state: FormState, type: TransactionType, categories: Category[]): FormState {
  const keepCategory = type !== 'transfer' && categories.some((c) => c.id === state.categoryId && c.kind === type)
  return {
    ...state,
    type,
    categoryId: keepCategory ? state.categoryId : null,
    toAccountId: type === 'transfer' ? state.toAccountId : null,
  }
}

/** Chips for the current type: active (or already chosen) only, most-used first, then the user's order. */
export function categoriesFor(categories: Category[], type: TransactionType, chosenId: number | null = null): Category[] {
  if (type === 'transfer') return []
  return categories
    .filter((c) => c.kind === type && (!c.archived || c.id === chosenId))
    .sort((a, b) => b.uses - a.uses || a.sortOrder - b.sortOrder)
}

/** Shape for transactionInput.safeParse; missing values become undefined so the schema says what's missing. */
export function toInput(state: FormState): unknown {
  const common = {
    type: state.type,
    date: state.date,
    amount: parseTaka(state.amount) ?? undefined,
    accountId: state.accountId ?? undefined,
    note: state.note.trim() || undefined,
  }
  return state.type === 'transfer'
    ? { ...common, toAccountId: state.toAccountId ?? undefined }
    : { ...common, categoryId: state.categoryId ?? undefined }
}
