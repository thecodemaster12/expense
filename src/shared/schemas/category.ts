import { z } from 'zod'
import { id, name } from './common.ts'

export const categoryKind = z.enum(['expense', 'income'])

export const categoryInput = z.object({
  name,
  kind: categoryKind,
  sortOrder: z.number().int().default(0),
  archived: z.boolean().default(false),
})

export const category = categoryInput.extend({ id })

export type CategoryKind = z.infer<typeof categoryKind>
export type CategoryInput = z.input<typeof categoryInput>
export type Category = z.infer<typeof category>
