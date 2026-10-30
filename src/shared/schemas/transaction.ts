import { z } from 'zod'
import { amount, id, isoDate, month } from './common.ts'

export const transactionType = z.enum(['expense', 'income', 'transfer'])

const pick = (what: string) => z.number({ error: `Pick ${what}` }).int().positive()

const base = {
  date: isoDate,
  amount,
  accountId: pick('an account'),
  note: z.string().trim().max(200).optional(),
}

// Expense/income need a category and no "to" account.
// Whether the category's kind matches the type is checked in the API (needs the DB).
const categorized = { ...base, categoryId: pick('a category'), toAccountId: z.null().default(null) }

/** Used for both create and edit: edits always send the whole transaction. */
export const transactionInput = z
  .discriminatedUnion('type', [
    z.object({ type: z.literal('expense'), ...categorized }),
    z.object({ type: z.literal('income'), ...categorized }),
    z.object({ type: z.literal('transfer'), ...base, toAccountId: pick('an account'), categoryId: z.null().default(null) }),
  ])
  .refine((t) => t.type !== 'transfer' || t.toAccountId !== t.accountId, {
    path: ['toAccountId'],
    error: 'Pick a different account',
  })

export const transactionQuery = z.object({
  month,
  accountId: z.coerce.number().pipe(id).optional(),
  categoryId: z.coerce.number().pipe(id).optional(),
  type: transactionType.optional(),
  cursor: z.string().regex(/^\d{4}-\d{2}-\d{2}_\d+$/).optional(),
})

export type TransactionType = z.infer<typeof transactionType>
export type TransactionInput = z.infer<typeof transactionInput>
/** What a form sends (defaults like toAccountId: null may be left out). */
export type NewTransaction = z.input<typeof transactionInput>
export type Transaction = TransactionInput & { id: number; createdAt: string }
export type TransactionQuery = z.infer<typeof transactionQuery>
export type TransactionPage = { items: Transaction[]; nextCursor: string | null }
