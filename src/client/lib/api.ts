// The ONLY data door for screens (docs/architecture.md).
// Phase 1: answers come from lib/fake/server.ts after a short delay.
// Phase 2: swap these bodies for fetch('/api/...') calls; signatures stay the same.
import type { AccountInput } from '../../shared/schemas/account.ts'
import type { CategoryInput } from '../../shared/schemas/category.ts'
import type { NewTransaction, TransactionQuery } from '../../shared/schemas/transaction.ts'
import * as fake from './fake/server.ts'

export { ApiError } from './api-error.ts'

const FAKE_DELAY_MS = 300

/** Runs a fake handler like a network call: async, delayed, and returning a copy. */
async function call<T>(handler: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
  return structuredClone(handler())
}

export const listAccounts = () => call(() => fake.listAccounts())
export const createAccount = (input: AccountInput) => call(() => fake.createAccount(input))
export const updateAccount = (id: number, patch: Partial<AccountInput>) => call(() => fake.updateAccount(id, patch))

export const listCategories = () => call(() => fake.listCategories())
export const createCategory = (input: CategoryInput) => call(() => fake.createCategory(input))
export const updateCategory = (id: number, patch: Partial<CategoryInput>) => call(() => fake.updateCategory(id, patch))

export const listTransactions = (query: TransactionQuery) => call(() => fake.listTransactions(query))
export const getTransaction = (id: number) => call(() => fake.getTransaction(id))
export const createTransaction = (input: NewTransaction) => call(() => fake.createTransaction(input))
export const updateTransaction = (id: number, input: NewTransaction) => call(() => fake.updateTransaction(id, input))
export const deleteTransaction = (id: number) => call(() => fake.deleteTransaction(id))

export const getSummary = (month: string) => call(() => fake.getSummary(month))
export const getMonthTotals = (from: string, to: string) => call(() => fake.getMonthTotals(from, to))
