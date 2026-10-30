import { queryOptions, type QueryClient } from '@tanstack/react-query'
import * as api from './api.ts'

export const accountsQuery = queryOptions({ queryKey: ['accounts'], queryFn: api.listAccounts })
export const categoriesQuery = queryOptions({ queryKey: ['categories'], queryFn: api.listCategories })

/** After any write, everything derived from transactions is stale. */
export function invalidateMoney(queryClient: QueryClient) {
  return Promise.all(
    ['transactions', 'accounts', 'summary', 'categories'].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  )
}
