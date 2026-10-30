import { z } from 'zod'
import { id, name } from './common.ts'

export const accountInput = z.object({
  name,
  openingBalance: z.number().int({ error: 'Whole taka only' }).default(0),
  sortOrder: z.number().int().default(0),
  archived: z.boolean().default(false),
})

/** PATCH body: only the fields sent. No defaults, so a rename can't reset the opening balance. */
export const accountPatch = z
  .object({ name, openingBalance: z.number().int({ error: 'Whole taka only' }), sortOrder: z.number().int(), archived: z.boolean() })
  .partial()

export const account = accountInput.extend({
  id,
  balance: z.number().int(),
})

export type AccountInput = z.input<typeof accountInput>
export type AccountPatch = z.infer<typeof accountPatch>
export type Account = z.infer<typeof account>
