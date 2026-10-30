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
