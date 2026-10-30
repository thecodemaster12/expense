import { describe, expect, it } from 'vitest'
import { formatTaka, parseTaka } from './money.ts'

describe('formatTaka', () => {
  it('uses lakh grouping', () => {
    expect(formatTaka(0)).toBe('৳0')
    expect(formatTaka(12500)).toBe('৳12,500')
    expect(formatTaka(115000)).toBe('৳1,15,000')
    expect(formatTaka(12500000)).toBe('৳1,25,00,000')
  })

  it('puts the minus before the sign', () => {
    expect(formatTaka(-3420)).toBe('−৳3,420')
  })
})

describe('parseTaka', () => {
  it('strips ৳, commas and spaces', () => {
    expect(parseTaka('৳1,15,000')).toBe(115000)
    expect(parseTaka(' 12,500 ')).toBe(12500)
    expect(parseTaka('0')).toBe(0)
  })

  it('rejects non whole taka', () => {
    expect(parseTaka('')).toBeNull()
    expect(parseTaka('12.50')).toBeNull()
    expect(parseTaka('-5')).toBeNull()
    expect(parseTaka('abc')).toBeNull()
    expect(parseTaka('99999999999999999999')).toBeNull()
  })
})
