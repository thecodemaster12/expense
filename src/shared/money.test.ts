import { describe, expect, it } from 'vitest'
import { compactTaka, formatTaka, parseSignedTaka, parseTaka } from './money.ts'

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

describe('parseSignedTaka', () => {
  it('accepts a leading minus (ASCII or typographic)', () => {
    expect(parseSignedTaka('-5,000')).toBe(-5000)
    expect(parseSignedTaka('−৳1,15,000')).toBe(-115000)
    expect(parseSignedTaka('2000')).toBe(2000)
    expect(parseSignedTaka('-0')).toBe(0)
  })

  it('rejects anything else', () => {
    expect(parseSignedTaka('--5')).toBeNull()
    expect(parseSignedTaka('5-')).toBeNull()
    expect(parseSignedTaka('')).toBeNull()
  })
})

describe('compactTaka', () => {
  it('shortens with K and lakh (L)', () => {
    expect(compactTaka(0)).toBe('৳0')
    expect(compactTaka(950)).toBe('৳950')
    expect(compactTaka(50000)).toBe('৳50K')
    expect(compactTaka(12500)).toBe('৳12.5K')
    expect(compactTaka(250000)).toBe('৳2.5L')
    expect(compactTaka(-30000)).toBe('−৳30K')
  })
})
