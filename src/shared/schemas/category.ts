import { z } from 'zod'
import { id, name } from './common.ts'

export const categoryKind = z.enum(['expense', 'income'])

export const categoryInput = z.object({
  name,
  kind: categoryKind,
  sortOrder: z.number().int().default(0),
  archived: z.boolean().default(false),
})

/** `uses` = transactions in the last 90 days, for "most-used first" chips. */
export const category = categoryInput.extend({ id, uses: z.number().int().nonnegative() })

export type CategoryKind = z.infer<typeof categoryKind>
export type CategoryInput = z.input<typeof categoryInput>
export type Category = z.infer<typeof category>
