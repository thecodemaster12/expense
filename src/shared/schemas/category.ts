import { z } from 'zod'
import { id, name } from './common.ts'

export const categoryKind = z.enum(['expense', 'income'])

/** Fixed palette; each maps to a text/background token pair in index.css (--color-cat-*). */
export const categoryColors = ['indigo', 'amber', 'slate', 'sky', 'rose', 'teal', 'purple', 'gray', 'green', 'orange'] as const
export const categoryColor = z.enum(categoryColors, { error: 'Pick a color' })

export const categoryInput = z.object({
  name,
  kind: categoryKind,
  color: categoryColor.optional(), // omitted on create → the server picks the next unused one
  sortOrder: z.number().int().default(0),
  archived: z.boolean().default(false),
})

/** PATCH body: only the fields sent. No defaults, so a rename can't reset order or archived. */
export const categoryPatch = z
  .object({ name, color: categoryColor, sortOrder: z.number().int(), archived: z.boolean() })
  .partial()

/** `uses` = transactions in the last 90 days, for "most-used first" chips. */
export const category = categoryInput.extend({ id, color: categoryColor, uses: z.number().int().nonnegative() })

export type CategoryKind = z.infer<typeof categoryKind>
export type CategoryColor = z.infer<typeof categoryColor>
export type CategoryInput = z.input<typeof categoryInput>
export type CategoryPatch = z.infer<typeof categoryPatch>
export type Category = z.infer<typeof category>

/** First palette color this kind isn't using yet (income starts at green); cycles once all are taken. */
export function nextColor(used: CategoryColor[], kind: CategoryKind): CategoryColor {
  const order = kind === 'income' ? ['green', ...categoryColors.filter((c) => c !== 'green')] : categoryColors
  return (order.find((c) => !used.includes(c as CategoryColor)) ?? order[used.length % order.length]) as CategoryColor
}
