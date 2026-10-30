// Phase 1 only: an in-memory stand-in for the Worker API. Same inputs, outputs and errors as docs/api.md.
// The real math lives in SQL in Phase 2; summing in JS here is fine because this file is deleted then.
import type { z } from 'zod'
import { addMonths, monthOf } from '../../../shared/date.ts'
import { accountInput, type Account, type AccountInput } from '../../../shared/schemas/account.ts'
import { categoryInput, type Category, type CategoryInput } from '../../../shared/schemas/category.ts'
import { fieldErrors } from '../../../shared/schemas/common.ts'
import type { MonthTotals, Summary } from '../../../shared/schemas/summary.ts'
import {
  transactionInput,
  transactionQuery,
  type Transaction,
  type TransactionPage,
} from '../../../shared/schemas/transaction.ts'
import { ApiError } from '../api-error.ts'
import * as fixtures from './fixtures.ts'

export const PAGE_SIZE = 50

let db = seed()

function seed() {
  return {
    accounts: structuredClone(fixtures.accounts),
    categories: structuredClone(fixtures.categories),
    transactions: fixtures.generateTransactions(),
  }
}

/** Back to the clean fixtures (tests). */
export function resetFakeDb() {
  db = seed()
}

function parse<S extends z.ZodType>(schema: S, input: unknown): z.infer<S> {
  const result = schema.safeParse(input)
  if (!result.success) throw new ApiError(400, 'validation', fieldErrors(result.error))
  return result.data
}

function notFound(what: string): never {
  throw new ApiError(404, `${what} not found`)
}

const nextId = (rows: { id: number }[]) => Math.max(0, ...rows.map((r) => r.id)) + 1

function assertUniqueName(rows: { id: number; name: string }[], name: string, selfId?: number) {
  if (rows.some((r) => r.id !== selfId && r.name.toLowerCase() === name.toLowerCase())) {
    throw new ApiError(400, 'validation', { name: 'Already exists' })
  }
}

// --- accounts ---

export function listAccounts(): Account[] {
  return db.accounts.map((a) => {
    let balance = a.openingBalance
    for (const t of db.transactions) {
      if (t.accountId === a.id) balance += t.type === 'income' ? t.amount : -t.amount
      if (t.type === 'transfer' && t.toAccountId === a.id) balance += t.amount
    }
    return { ...a, balance }
  })
}

export function createAccount(input: AccountInput): Account {
  const data = parse(accountInput, input)
  assertUniqueName(db.accounts, data.name)
  db.accounts.push({ ...data, id: nextId(db.accounts) })
  return listAccounts().at(-1)!
}

export function updateAccount(id: number, patch: Partial<AccountInput>): Account {
  const row = db.accounts.find((a) => a.id === id) ?? notFound('Account')
  const data = parse(accountInput.partial(), patch)
  if (data.name) assertUniqueName(db.accounts, data.name, id)
  Object.assign(row, data)
  return listAccounts().find((a) => a.id === id)!
}

// --- categories ---

export function listCategories(): Category[] {
  return db.categories
}

export function createCategory(input: CategoryInput): Category {
  const data = parse(categoryInput, input)
  assertUniqueName(db.categories, data.name)
  const row = { ...data, id: nextId(db.categories) }
  db.categories.push(row)
  return row
}

export function updateCategory(id: number, patch: Partial<CategoryInput>): Category {
  const row = db.categories.find((c) => c.id === id) ?? notFound('Category')
  const data = parse(categoryInput.partial(), patch)
  if (data.name) assertUniqueName(db.categories, data.name, id)
  Object.assign(row, data)
  return row
}

// --- transactions ---

export function listTransactions(query: z.input<typeof transactionQuery>): TransactionPage {
  const q = parse(transactionQuery, query)
  const [cursorDate, cursorId] = q.cursor ? [q.cursor.slice(0, 10), Number(q.cursor.slice(11))] : []

  const rows = db.transactions
    .filter((t) => monthOf(t.date) === q.month)
    .filter((t) => !q.accountId || t.accountId === q.accountId || t.toAccountId === q.accountId)
    .filter((t) => !q.categoryId || t.categoryId === q.categoryId)
    .filter((t) => !q.type || t.type === q.type)
    .filter((t) => !cursorDate || t.date < cursorDate || (t.date === cursorDate && t.id < cursorId!))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)

  const items = rows.slice(0, PAGE_SIZE)
  const last = items.at(-1)
  return { items, nextCursor: rows.length > PAGE_SIZE && last ? `${last.date}_${last.id}` : null }
}

/** Checks the schema can't: referenced rows exist and the category kind matches the type. */
function validTransaction(input: unknown) {
  const data = parse(transactionInput, input)
  const fields: Record<string, string> = {}
  if (!db.accounts.some((a) => a.id === data.accountId)) fields.accountId = 'Unknown account'
  if (data.type === 'transfer') {
    if (!db.accounts.some((a) => a.id === data.toAccountId)) fields.toAccountId = 'Unknown account'
  } else {
    const category = db.categories.find((c) => c.id === data.categoryId)
    if (!category) fields.categoryId = 'Unknown category'
    else if (category.kind !== data.type) fields.categoryId = `Pick an ${data.type} category`
  }
  if (Object.keys(fields).length) throw new ApiError(400, 'validation', fields)
  return data
}

export function createTransaction(input: unknown): Transaction {
  const row: Transaction = {
    ...validTransaction(input),
    id: nextId(db.transactions),
    createdAt: new Date().toISOString(),
  }
  db.transactions.push(row)
  return row
}

export function updateTransaction(id: number, input: unknown): Transaction {
  const index = db.transactions.findIndex((t) => t.id === id)
  if (index < 0) notFound('Transaction')
  const old = db.transactions[index]
  const row: Transaction = { ...validTransaction(input), id, createdAt: old.createdAt }
  db.transactions[index] = row
  return row
}

export function deleteTransaction(id: number): void {
  const index = db.transactions.findIndex((t) => t.id === id)
  if (index < 0) notFound('Transaction')
  db.transactions.splice(index, 1)
}

// --- summary ---

function totals(month: string) {
  const rows = db.transactions.filter((t) => monthOf(t.date) === month)
  const sum = (type: Transaction['type']) =>
    rows.filter((t) => t.type === type).reduce((n, t) => n + t.amount, 0)
  const income = sum('income')
  const spent = sum('expense')
  return { rows, income, spent, saved: income - spent }
}

export function getSummary(month: string): Summary {
  const { rows, income, spent, saved } = totals(month)
  const byId = new Map<number, number>()
  for (const t of rows) {
    if (t.type === 'expense') byId.set(t.categoryId, (byId.get(t.categoryId) ?? 0) + t.amount)
  }
  const byCategory = [...byId]
    .map(([categoryId, amount]) => ({
      categoryId,
      category: db.categories.find((c) => c.id === categoryId)?.name ?? '?',
      amount,
      share: spent ? amount / spent : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
  return { income, spent, saved, savingsRate: income ? saved / income : 0, byCategory }
}

export function getMonthTotals(from: string, to: string): MonthTotals[] {
  const result: MonthTotals[] = []
  for (let m = from; m <= to; m = addMonths(m, 1)) {
    const { income, spent, saved } = totals(m)
    result.push({ month: m, income, spent, saved })
  }
  return result
}
