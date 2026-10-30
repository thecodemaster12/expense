import { z } from 'zod'
import { id, name } from './common.ts'

export const accountInput = z.object({
  name,
  openingBalance: z.number().int({ error: 'Whole taka only' }).default(0),
  sortOrder: z.number().int().default(0),
  archived: z.boolean().default(false),
})

export const account = accountInput.extend({
  id,
  balance: z.number().int(),
})

export type AccountInput = z.input<typeof accountInput>
export type Account = z.infer<typeof account>
