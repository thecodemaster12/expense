import { z } from 'zod'
import { color, id, name } from './common.ts'

export const categoryKind = z.enum(['expense', 'income'])

export const categoryInput = z.object({
  name,
  kind: categoryKind,
  color: color.optional(), // omitted on create → the server picks the next unused one
  sortOrder: z.number().int().default(0),
  archived: z.boolean().default(false),
})

/** PATCH body: only the fields sent. No defaults, so a rename can't reset order or archived. */
export const categoryPatch = z
  .object({ name, color: color, sortOrder: z.number().int(), archived: z.boolean() })
  .partial()

/** `uses` = transactions in the last 90 days, for "most-used first" chips. */
export const category = categoryInput.extend({ id, color: color, uses: z.number().int().nonnegative() })

export type CategoryKind = z.infer<typeof categoryKind>
export type CategoryInput = z.input<typeof categoryInput>
export type CategoryPatch = z.infer<typeof categoryPatch>
export type Category = z.infer<typeof category>
