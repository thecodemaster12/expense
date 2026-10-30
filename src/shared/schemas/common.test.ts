import { describe, expect, it } from 'vitest'
import { colors, nextColor } from './common.ts'

describe('nextColor', () => {
  it('takes the first unused palette color', () => {
    expect(nextColor([])).toBe('indigo')
    expect(nextColor(['indigo', 'amber'])).toBe('slate')
  })

  it('can start from a given color (income starts at green)', () => {
    expect(nextColor([], 'green')).toBe('green')
    expect(nextColor(['green'], 'green')).toBe('indigo')
  })

  it('cycles once every color is used', () => {
    expect(colors).toContain(nextColor([...colors]))
  })
})
