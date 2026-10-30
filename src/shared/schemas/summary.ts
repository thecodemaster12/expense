import { z } from 'zod'
import { id, month } from './common.ts'

const taka = z.number().int()

export const summary = z.object({
  income: taka,
  spent: taka,
  saved: taka,
  savingsRate: z.number(), // 0..1, 0 when income is 0
  byCategory: z.array(
    z.object({ categoryId: id, category: z.string(), amount: taka, share: z.number() }),
  ),
})

export const monthTotals = z.object({ month, income: taka, spent: taka, saved: taka })

export type Summary = z.infer<typeof summary>
export type MonthTotals = z.infer<typeof monthTotals>
