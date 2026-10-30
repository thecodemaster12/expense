import { describe, expect, it } from 'vitest'
import { addDays, addMonths, isValidDate, monthLabel, monthOf, todayDhaka } from './date.ts'

describe('todayDhaka', () => {
  it('is already tomorrow in Dhaka at 23:30 UTC', () => {
    expect(todayDhaka(new Date('2026-10-30T23:30:00Z'))).toBe('2026-10-31')
  })

  it('rolls the month and year over', () => {
    expect(todayDhaka(new Date('2026-12-31T18:00:00Z'))).toBe('2027-01-01')
  })

  it('stays on the same day before 18:00 UTC', () => {
    expect(todayDhaka(new Date('2026-10-30T17:59:00Z'))).toBe('2026-10-30')
  })
})

describe('isValidDate', () => {
  it('accepts real dates only', () => {
    expect(isValidDate('2026-02-28')).toBe(true)
    expect(isValidDate('2028-02-29')).toBe(true)
    expect(isValidDate('2026-02-29')).toBe(false)
    expect(isValidDate('2026-13-01')).toBe(false)
    expect(isValidDate('3 Nov 2026')).toBe(false)
  })
})

describe('month helpers', () => {
  it('monthOf', () => expect(monthOf('2026-11-03')).toBe('2026-11'))

  it('addMonths crosses years both ways', () => {
    expect(addMonths('2026-01', -1)).toBe('2025-12')
    expect(addMonths('2026-12', 1)).toBe('2027-01')
    expect(addMonths('2026-11', -5)).toBe('2026-06')
  })

  it('addDays crosses months and years', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-11-03', -90)).toBe('2026-08-05')
  })

  it('monthLabel', () => expect(monthLabel('2026-11')).toBe('Nov 2026'))
})
