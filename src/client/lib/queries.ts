import { queryOptions, type QueryClient } from '@tanstack/react-query'
import * as api from './api.ts'

export const meQuery = queryOptions({ queryKey: ['me'], queryFn: api.getMe, staleTime: Infinity })
export const accountsQuery = queryOptions({ queryKey: ['accounts'], queryFn: api.listAccounts })
export const categoriesQuery = queryOptions({ queryKey: ['categories'], queryFn: api.listCategories })
export const summaryQuery = (month: string) =>
  queryOptions({ queryKey: ['summary', month], queryFn: () => api.getSummary(month) })
export const monthTotalsQuery = (from: string, to: string) =>
  queryOptions({ queryKey: ['summary', 'months', from, to], queryFn: () => api.getMonthTotals(from, to) })

/** After any write, everything derived from transactions is stale. */
export function invalidateMoney(queryClient: QueryClient) {
  return Promise.all(
    ['transactions', 'accounts', 'summary', 'categories'].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  )
}
