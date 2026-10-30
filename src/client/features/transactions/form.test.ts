import { describe, expect, it } from 'vitest'
import type { Account } from '../../../shared/schemas/account.ts'
import type { Category } from '../../../shared/schemas/category.ts'
import { transactionInput } from '../../../shared/schemas/transaction.ts'
import { categoriesFor, changeType, newForm, toInput, type FormState } from './form.ts'

const cat = (id: number, kind: 'expense' | 'income', uses: number, sortOrder = id, archived = false): Category => ({
  id, name: `c${id}`, kind, color: 'gray', uses, sortOrder, archived,
})
const categories = [cat(1, 'expense', 2), cat(2, 'expense', 9), cat(3, 'expense', 2, 0), cat(4, 'expense', 50, 4, true), cat(9, 'income', 1)]

const acc = (id: number, archived = false): Account => ({ id, name: `a${id}`, color: 'gray', icon: 'wallet', openingBalance: 0, sortOrder: id, archived, balance: 0 })
const accounts = [acc(1, true), acc(2), acc(3)]

const base: FormState = { type: 'expense', amount: '450', categoryId: 2, accountId: 2, toAccountId: null, date: '2026-10-30', note: '' }

describe('newForm', () => {
  it('starts on expense with the last-used account if still active', () => {
    expect(newForm(accounts, 3)).toMatchObject({ type: 'expense', accountId: 3, amount: '' })
  })

  it('falls back to the first active account', () => {
    expect(newForm(accounts, 1).accountId).toBe(2)
    expect(newForm(accounts, null).accountId).toBe(2)
  })
})

describe('changeType', () => {
  it('transfer clears the category', () => {
    expect(changeType(base, 'transfer', categories).categoryId).toBeNull()
  })

  it('expense → income clears an expense category', () => {
    expect(changeType(base, 'income', categories).categoryId).toBeNull()
  })

  it('leaving transfer clears the to-account', () => {
    const transfer = { ...base, type: 'transfer' as const, categoryId: null, toAccountId: 3 }
    expect(changeType(transfer, 'expense', categories).toAccountId).toBeNull()
  })

  it('keeps a category that still fits', () => {
    expect(changeType(base, 'expense', categories).categoryId).toBe(2)
  })
})

describe('categoriesFor', () => {
  it('most-used first, then sort order; hides archived and other kinds', () => {
    expect(categoriesFor(categories, 'expense').map((c) => c.id)).toEqual([2, 3, 1])
    expect(categoriesFor(categories, 'income').map((c) => c.id)).toEqual([9])
    expect(categoriesFor(categories, 'transfer')).toEqual([])
  })
})

describe('toInput', () => {
  it('produces a valid expense', () => {
    expect(transactionInput.safeParse(toInput(base)).success).toBe(true)
  })

  it('reports what is missing, with friendly messages', () => {
    const result = transactionInput.safeParse(toInput({ ...base, amount: '', categoryId: null }))
    expect(result.success).toBe(false)
    const messages = Object.fromEntries(result.error!.issues.map((i) => [i.path.join('.'), i.message]))
    expect(messages).toEqual({ amount: 'Enter an amount', categoryId: 'Pick a category' })
  })

  it('produces a valid transfer without a category', () => {
    const transfer = changeType({ ...base, toAccountId: 3 }, 'transfer', categories)
    expect(transactionInput.parse(toInput({ ...transfer, toAccountId: 3 }))).toMatchObject({ type: 'transfer', toAccountId: 3, categoryId: null })
  })
})
