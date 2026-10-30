import { z } from 'zod'
import { isValidDate } from '../date.ts'

export const id = z.number().int().positive()

export const isoDate = z.string().refine(isValidDate, { error: 'Pick a valid date' })

export const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, { error: 'Use YYYY-MM' })

/** Whole taka, always positive. Direction comes from the transaction type. */
export const amount = z
  .number({ error: 'Enter an amount' })
  .int({ error: 'Whole taka only' })
  .positive({ error: 'Must be more than 0' })

export const name = z.string().trim().min(1, { error: 'Enter a name' }).max(40)

/** Fixed color palette for categories and accounts; each maps to --color-cat-<name> tokens in index.css. */
export const colors = ['indigo', 'amber', 'slate', 'sky', 'rose', 'teal', 'purple', 'gray', 'green', 'orange'] as const
export const color = z.enum(colors, { error: 'Pick a color' })
export type Color = z.infer<typeof color>

/** First palette color not in `used` (starting from `first`); cycles once all are taken. */
export function nextColor(used: Color[], first: Color = colors[0]): Color {
  const order = [first, ...colors.filter((c) => c !== first)]
  return order.find((c) => !used.includes(c)) ?? order[used.length % order.length]
}

/** First message per field, e.g. { amount: "Must be more than 0" }. Shape of the API's 400 body. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form'
    fields[key] ??= issue.message
  }
  return fields
}
