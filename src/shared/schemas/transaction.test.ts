import { describe, expect, it } from 'vitest'
import { transactionInput, transactionQuery } from './transaction.ts'

const expense = { type: 'expense', date: '2026-11-03', amount: 3420, accountId: 1, categoryId: 2 }
const transfer = { type: 'transfer', date: '2026-11-03', amount: 5000, accountId: 1, toAccountId: 2 }

function errorPaths(input: unknown) {
  const result = transactionInput.safeParse(input)
  return result.success ? [] : result.error.issues.map((i) => i.path.join('.'))
}

describe('transactionInput', () => {
  it('accepts a valid expense and income', () => {
    expect(transactionInput.parse(expense)).toMatchObject({ ...expense, toAccountId: null })
    expect(errorPaths({ ...expense, type: 'income' })).toEqual([])
  })

  it('accepts a valid transfer with no category', () => {
    expect(transactionInput.parse(transfer)).toMatchObject({ ...transfer, categoryId: null })
  })

  it('rejects zero, negative and fractional amounts', () => {
    expect(errorPaths({ ...expense, amount: 0 })).toEqual(['amount'])
    expect(errorPaths({ ...expense, amount: -5 })).toEqual(['amount'])
    expect(errorPaths({ ...expense, amount: 12.5 })).toEqual(['amount'])
  })

  it('rejects an invalid date', () => {
    expect(errorPaths({ ...expense, date: '2026-02-30' })).toEqual(['date'])
  })

  it('expense/income need a category and no to-account', () => {
    expect(errorPaths({ ...expense, categoryId: undefined })).toEqual(['categoryId'])
    expect(errorPaths({ ...expense, toAccountId: 2 })).toEqual(['toAccountId'])
  })

  it('transfer needs a different to-account and no category', () => {
    expect(errorPaths({ ...transfer, toAccountId: undefined })).toEqual(['toAccountId'])
    expect(errorPaths({ ...transfer, toAccountId: 1 })).toEqual(['toAccountId'])
    expect(errorPaths({ ...transfer, categoryId: 3 })).toEqual(['categoryId'])
  })

  it('rejects an unknown type', () => {
    expect(errorPaths({ ...expense, type: 'loan' })).toEqual(['type'])
  })
})

describe('transactionQuery', () => {
  it('coerces query-string ids and requires a month', () => {
    expect(transactionQuery.parse({ month: '2026-11', accountId: '3' })).toEqual({ month: '2026-11', accountId: 3 })
    expect(transactionQuery.safeParse({}).success).toBe(false)
    expect(transactionQuery.safeParse({ month: '2026-13' }).success).toBe(false)
  })
})
