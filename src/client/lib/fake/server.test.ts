import { beforeEach, describe, expect, it } from 'vitest'
import { transactionInput } from '../../../shared/schemas/transaction.ts'
import { ApiError } from '../api-error.ts'
import { BANK, BKASH, CASH, FOOD, generateTransactions, SALARY } from './fixtures.ts'
import * as fake from './server.ts'

const total = () => fake.listAccounts().reduce((n, a) => n + a.balance, 0)

function apiError(fn: () => unknown): ApiError {
  try {
    fn()
  } catch (e) {
    if (e instanceof ApiError) return e
    throw e
  }
  throw new Error('expected an ApiError')
}

beforeEach(() => fake.resetFakeDb())

describe('fixtures', () => {
  it('every transaction passes the shared schema', () => {
    for (const t of generateTransactions()) expect(transactionInput.safeParse(t).success).toBe(true)
  })

  it('are the same on every load', () => {
    expect(generateTransactions()).toEqual(generateTransactions())
  })
})

describe('transfers', () => {
  it('never count as income or spending, and keep the total balance', () => {
    const before = { summary: fake.getSummary('2026-10'), total: total() }
    fake.createTransaction({ type: 'transfer', date: '2026-10-15', amount: 7000, accountId: BANK, toAccountId: CASH })
    expect(fake.getSummary('2026-10')).toEqual(before.summary)
    expect(total()).toBe(before.total)
  })

  it('move money between the two accounts', () => {
    const balance = (id: number) => fake.listAccounts().find((a) => a.id === id)!.balance
    const [bank, bkash] = [balance(BANK), balance(BKASH)]
    fake.createTransaction({ type: 'transfer', date: '2026-10-15', amount: 7000, accountId: BANK, toAccountId: BKASH })
    expect(balance(BANK)).toBe(bank - 7000)
    expect(balance(BKASH)).toBe(bkash + 7000)
  })
})

describe('summary', () => {
  it('saved = income - spent, and shares add up to 1', () => {
    const s = fake.getSummary('2026-09')
    expect(s.saved).toBe(s.income - s.spent)
    expect(s.savingsRate).toBeCloseTo(s.saved / s.income)
    expect(s.byCategory.reduce((n, c) => n + c.amount, 0)).toBe(s.spent)
    expect(s.byCategory.reduce((n, c) => n + c.share, 0)).toBeCloseTo(1)
  })

  it('an empty month is all zeros', () => {
    expect(fake.getSummary('2020-01')).toEqual({ income: 0, spent: 0, saved: 0, savingsRate: 0, byCategory: [] })
  })

  it('month totals include every month in range', () => {
    expect(fake.getMonthTotals('2026-05', '2026-10').map((m) => m.month)).toEqual([
      '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10',
    ])
  })
})

describe('listTransactions paging', () => {
  it('returns 50 per page, newest first, with no gaps or repeats', () => {
    for (let i = 0; i < 60; i++) {
      fake.createTransaction({ type: 'expense', date: '2026-06-15', amount: 100, accountId: CASH, categoryId: FOOD })
    }
    const expected = generateTransactions().filter((t) => t.date.startsWith('2026-06')).length + 60

    const seen: number[] = []
    let cursor: string | undefined
    let pages = 0
    do {
      const page = fake.listTransactions({ month: '2026-06', cursor })
      expect(page.items.length).toBeLessThanOrEqual(fake.PAGE_SIZE)
      seen.push(...page.items.map((t) => t.id))
      cursor = page.nextCursor ?? undefined
      pages++
    } while (cursor)

    expect(pages).toBeGreaterThan(1)
    expect(seen).toHaveLength(expected)
    expect(new Set(seen).size).toBe(expected)
  })
})

describe('validation', () => {
  it('rejects an expense with an income category', () => {
    const e = apiError(() =>
      fake.createTransaction({ type: 'expense', date: '2026-10-01', amount: 100, accountId: CASH, categoryId: SALARY }),
    )
    expect(e.status).toBe(400)
    expect(e.fields.categoryId).toBe('Pick an expense category')
  })

  it('returns field errors from the schema', () => {
    const e = apiError(() => fake.createTransaction({ type: 'expense', date: '2026-10-01', amount: 0, accountId: CASH, categoryId: FOOD }))
    expect(e.fields).toEqual({ amount: 'Must be more than 0' })
  })

  it('rejects duplicate account names, case-insensitive', () => {
    expect(apiError(() => fake.createAccount({ name: 'bkash' })).fields).toEqual({ name: 'Already exists' })
  })

  it('404s on a missing transaction', () => {
    expect(apiError(() => fake.deleteTransaction(99999)).status).toBe(404)
  })
})
