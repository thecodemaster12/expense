import { z } from 'zod'
import { color, id, name } from './common.ts'

/** Fixed icon set; the client maps each name to a lucide icon (ui/account-icons.ts). */
export const accountIcons = ['bank', 'wallet', 'mobile', 'card', 'savings', 'cash', 'coins', 'work', 'home', 'safe'] as const
export const accountIcon = z.enum(accountIcons, { error: 'Pick an icon' })

export const accountInput = z.object({
  name,
  color: color.optional(), // omitted on create → the server picks the next unused one
  icon: accountIcon.default('wallet'),
  openingBalance: z.number().int({ error: 'Whole taka only' }).default(0),
  sortOrder: z.number().int().default(0),
  archived: z.boolean().default(false),
})

/** PATCH body: only the fields sent. No defaults, so a rename can't reset the opening balance. */
export const accountPatch = z
  .object({ name, color, icon: accountIcon, openingBalance: z.number().int({ error: 'Whole taka only' }), sortOrder: z.number().int(), archived: z.boolean() })
  .partial()

export const account = accountInput.extend({
  id,
  color,
  balance: z.number().int(),
})

export type AccountIcon = z.infer<typeof accountIcon>
export type AccountInput = z.input<typeof accountInput>
export type AccountPatch = z.infer<typeof accountPatch>
export type Account = z.infer<typeof account>
