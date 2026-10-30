import { beforeEach, describe, expect, it } from 'vitest'
import { transactionInput } from '../../../shared/schemas/transaction.ts'
import { ApiError } from '../api-error.ts'
import { BANK, BKASH, CASH, FOOD, generateTransactions, OTHER, OTHER_INCOME, RENT, SALARY } from './fixtures.ts'
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

describe('deleting a category', () => {
  const usage = (id: number) => fake.getCategoryUsage(id).count

  it('moves its entries to the target, then deletes it; spending is unchanged', () => {
    const foodCount = usage(FOOD)
    const otherCount = usage(OTHER)
    const spent = fake.getSummary('2026-10').spent
    fake.deleteCategory(FOOD, OTHER)
    expect(fake.listCategories().some((c) => c.id === FOOD)).toBe(false)
    expect(usage(OTHER)).toBe(otherCount + foodCount)
    expect(fake.getSummary('2026-10').spent).toBe(spent)
  })

  it('requires a target when entries use it', () => {
    expect(apiError(() => fake.deleteCategory(FOOD)).fields.moveTo).toMatch(/Pick where to move \d+ entries/)
  })

  it('rejects a target of the other kind or itself', () => {
    expect(apiError(() => fake.deleteCategory(FOOD, SALARY)).fields.moveTo).toBe('Pick another expense category')
    expect(apiError(() => fake.deleteCategory(FOOD, FOOD)).fields.moveTo).toBe('Pick another expense category')
  })

  it('deletes an unused category without a target', () => {
    const fresh = fake.createCategory({ name: 'Gifts', kind: 'expense' })
    fake.deleteCategory(fresh.id)
    expect(fake.listCategories().some((c) => c.id === fresh.id)).toBe(false)
  })

  it('keeps at least one category of each kind', () => {
    fake.deleteCategory(SALARY, OTHER_INCOME)
    expect(apiError(() => fake.deleteCategory(OTHER_INCOME)).fields.form).toBe('Keep at least one income category')
  })

  it('404s on a missing category', () => {
    expect(apiError(() => fake.deleteCategory(999, RENT)).status).toBe(404)
  })
})

describe('category colors and patches', () => {
  const find = (id: number) => fake.listCategories().find((c) => c.id === id)!

  it('a rename keeps the color and the order', () => {
    const before = find(FOOD)
    fake.updateCategory(FOOD, { name: 'Groceries' })
    expect(find(FOOD)).toMatchObject({ name: 'Groceries', color: before.color, sortOrder: before.sortOrder })
  })

  it('recolors on request and rejects colors outside the palette', () => {
    fake.updateCategory(FOOD, { color: 'orange' })
    expect(find(FOOD).color).toBe('orange')
    // @ts-expect-error not a palette color
    expect(apiError(() => fake.updateCategory(FOOD, { color: 'pink' })).fields.color).toBe('Pick a color')
  })

  it('a new category gets an unused color unless one is given', () => {
    expect(fake.createCategory({ name: 'Internet', kind: 'expense' }).color).toBe('green')
    expect(fake.createCategory({ name: 'Gifts', kind: 'expense', color: 'rose' }).color).toBe('rose')
  })

  it('renaming an account keeps its opening balance', () => {
    fake.updateAccount(BANK, { name: 'City Bank' })
    expect(fake.listAccounts().find((a) => a.id === BANK)).toMatchObject({ name: 'City Bank', openingBalance: 40000 })
  })
})

describe('accounts', () => {
  const balance = (id: number) => fake.listAccounts().find((a) => a.id === id)!.balance

  it('balance = opening + income + transfers in - expenses - transfers out', () => {
    fake.createAccount({ name: 'Wallet', openingBalance: 1000 })
    const id = fake.listAccounts().find((a) => a.name === 'Wallet')!.id
    fake.createTransaction({ type: 'income', date: '2026-10-01', amount: 500, accountId: id, categoryId: SALARY })
    fake.createTransaction({ type: 'transfer', date: '2026-10-02', amount: 300, accountId: BANK, toAccountId: id })
    fake.createTransaction({ type: 'expense', date: '2026-10-03', amount: 200, accountId: id, categoryId: FOOD })
    fake.createTransaction({ type: 'transfer', date: '2026-10-04', amount: 100, accountId: id, toAccountId: CASH })
    expect(balance(id)).toBe(1000 + 500 + 300 - 200 - 100)
  })

  it('changing the opening balance shifts the balance by the same amount', () => {
    const before = balance(CASH)
    fake.updateAccount(CASH, { openingBalance: 3000 - 1000 })
    expect(balance(CASH)).toBe(before - 1000)
  })

  it('archived accounts keep their balance and stay in the list', () => {
    const before = balance(BKASH)
    fake.updateAccount(BKASH, { archived: true })
    expect(fake.listAccounts().find((a) => a.id === BKASH)).toMatchObject({ archived: true, balance: before })
  })

  it('keeps at least one active account', () => {
    fake.updateAccount(BKASH, { archived: true })
    fake.updateAccount(CASH, { archived: true })
    expect(apiError(() => fake.updateAccount(BANK, { archived: true })).fields.form).toBe('Keep at least one active account')
  })

  it('a new account gets an unused color unless one is given', () => {
    expect(fake.createAccount({ name: 'Nagad' }).color).toBe('indigo')
    expect(fake.createAccount({ name: 'Savings', color: 'teal' }).color).toBe('teal')
  })
})

describe('account icons', () => {
  const find = (id: number) => fake.listAccounts().find((a) => a.id === id)!

  it('a rename keeps the icon; icons can change; others are rejected', () => {
    fake.updateAccount(BKASH, { name: 'bKash Personal' })
    expect(find(BKASH).icon).toBe('mobile')
    fake.updateAccount(BKASH, { icon: 'card' })
    expect(find(BKASH).icon).toBe('card')
    // @ts-expect-error not in the icon set
    expect(apiError(() => fake.updateAccount(BKASH, { icon: 'rocket' })).fields.icon).toBe('Pick an icon')
  })

  it('new accounts default to the wallet icon', () => {
    expect(fake.createAccount({ name: 'Nagad' }).icon).toBe('wallet')
  })
})
