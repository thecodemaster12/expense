import { describe as group, expect, it } from 'vitest'
import type { Transaction } from '../../../shared/schemas/transaction.ts'
import { describe, groupByDay, readFilters, writeFilters } from './list.ts'

let nextId = 1
const tx = (date: string, type: Transaction['type'], amount: number): Transaction =>
  type === 'transfer'
    ? { id: nextId++, createdAt: '', date, type, amount, accountId: 1, toAccountId: 2, categoryId: null }
    : { id: nextId++, createdAt: '', date, type, amount, accountId: 1, categoryId: 5, toAccountId: null }

group('groupByDay', () => {
  it('groups consecutive days and sums only expenses', () => {
    const groups = groupByDay([
      tx('2026-10-30', 'expense', 450),
      tx('2026-10-30', 'transfer', 5000),
      tx('2026-10-30', 'income', 2000),
      tx('2026-10-30', 'expense', 50),
      tx('2026-10-28', 'transfer', 1000),
    ])
    expect(groups.map((g) => [g.date, g.items.length, g.spent])).toEqual([
      ['2026-10-30', 4, 500],
      ['2026-10-28', 1, 0],
    ])
  })

  it('handles an empty list', () => expect(groupByDay([])).toEqual([]))
})

group('describe', () => {
  const accounts = [{ id: 1, name: 'Bank' }, { id: 2, name: 'bKash' }].map((a) => ({ ...a, openingBalance: 0, sortOrder: 0, archived: false, balance: 0 }))
  const categories = [{ id: 5, name: 'Food', kind: 'expense' as const, sortOrder: 0, archived: false, uses: 0 }]

  it('names the category or the transfer route', () => {
    expect(describe(tx('2026-10-30', 'expense', 115000), accounts, categories)).toBe('৳1,15,000 · Food')
    expect(describe(tx('2026-10-30', 'transfer', 5000), accounts, categories)).toBe('৳5,000 · Bank → bKash')
  })
})

group('URL filters', () => {
  it('round-trips', () => {
    const q = { month: '2026-09', accountId: 2, categoryId: 5, type: 'expense' as const }
    expect(readFilters(writeFilters(q), '2026-10')).toEqual(q)
  })

  it('defaults to the current month', () => {
    expect(readFilters(new URLSearchParams(), '2026-10')).toEqual({ month: '2026-10' })
  })

  it('falls back on junk instead of crashing', () => {
    expect(readFilters(new URLSearchParams('month=nope&account=abc'), '2026-10')).toEqual({ month: '2026-10' })
  })
})
