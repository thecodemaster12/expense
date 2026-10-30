import { describe, expect, it } from 'vitest'
import { categoryColors, nextColor } from './category.ts'

describe('nextColor', () => {
  it('takes the first unused palette color', () => {
    expect(nextColor([], 'expense')).toBe('indigo')
    expect(nextColor(['indigo', 'amber'], 'expense')).toBe('slate')
  })

  it('starts income at green', () => {
    expect(nextColor([], 'income')).toBe('green')
    expect(nextColor(['green'], 'income')).toBe('indigo')
  })

  it('cycles once every color is used', () => {
    expect(categoryColors).toContain(nextColor([...categoryColors], 'expense'))
  })
})
