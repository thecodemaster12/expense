import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { dayLabel, monthLabel, monthOf, todayDhaka } from '../../../shared/date.ts'
import type { Transaction, TransactionQuery, TransactionType } from '../../../shared/schemas/transaction.ts'
import * as api from '../../lib/api.ts'
import { accountsQuery, categoriesQuery, invalidateMoney } from '../../lib/queries.ts'
import { Button } from '../../ui/Button.tsx'
import { ConfirmDialog } from '../../ui/ConfirmDialog.tsx'
import { Money } from '../../ui/Money.tsx'
import { MonthSwitcher } from '../../ui/MonthSwitcher.tsx'
import { SegmentedControl } from '../../ui/SegmentedControl.tsx'
import { useToast } from '../../ui/toast-context.ts'
import { describe, groupByDay, readFilters, writeFilters } from './list.ts'
import { TransactionRow } from './TransactionRow.tsx'

const typeOptions: { value: TransactionType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
]

const selectClass = 'h-10 w-full rounded-input border border-border-input bg-surface px-3 text-body'

export function TransactionsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const filters = readFilters(params, monthOf(todayDhaka()))
  // replace: filter tweaks don't pile up in Back history
  const update = (patch: Partial<TransactionQuery>) => setParams(writeFilters({ ...filters, ...patch }), { replace: true })

  const accounts = useQuery(accountsQuery)
  const categories = useQuery(categoriesQuery)
  const list = useInfiniteQuery({
    queryKey: ['transactions', 'list', filters],
    queryFn: ({ pageParam }) => api.listTransactions({ ...filters, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  })

  const [deleting, setDeleting] = useState<Transaction | null>(null)
  const remove = useMutation({
    mutationFn: (t: Transaction) => api.deleteTransaction(t.id),
    onSuccess: (_, t) => {
      setDeleting(null)
      void invalidateMoney(queryClient)
      toast({ message: `Deleted ${describe(t, accounts.data, categories.data)}` })
    },
    onError: () => toast({ message: "Couldn't delete. Try again." }),
  })

  const accountName = (id: number | null) => accounts.data?.find((a) => a.id === id)?.name ?? ''
  const categoryOptions = (categories.data ?? []).filter((c) => !filters.type || c.kind === filters.type)
  const items = list.data?.pages.flatMap((p) => p.items) ?? []

  function setType(value: TransactionType | 'all') {
    const type = value === 'all' ? undefined : value
    const category = categories.data?.find((c) => c.id === filters.categoryId)
    const keepCategory = category && type !== 'transfer' && (!type || category.kind === type)
    update({ type, categoryId: keepCategory ? filters.categoryId : undefined })
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-headline-sm lg:text-headline">Transactions</h1>
        <MonthSwitcher month={filters.month} onChange={(month) => update({ month })} />
      </div>

      <div className="mt-4 space-y-2">
        <SegmentedControl label="Type" options={typeOptions} value={filters.type ?? 'all'} onChange={setType} />
        <div className="grid grid-cols-2 gap-2">
          <select
            aria-label="Account"
            className={selectClass}
            value={filters.accountId ?? ''}
            onChange={(e) => update({ accountId: Number(e.target.value) || undefined })}
          >
            <option value="">All accounts</option>
            {accounts.data?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {filters.type !== 'transfer' && (
            <select
              aria-label="Category"
              className={selectClass}
              value={filters.categoryId ?? ''}
              onChange={(e) => update({ categoryId: Number(e.target.value) || undefined })}
            >
              <option value="">All categories</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {list.isPending ? (
        <p className="mt-6 text-muted">Loading…</p>
      ) : list.isError ? (
        <p className="mt-6 text-expense">Couldn't load entries. Check your connection.</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-muted">No entries for {monthLabel(filters.month)}.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {groupByDay(items).map((group) => (
            <section key={group.date}>
              <div className="flex items-baseline justify-between px-1 pb-2">
                <h2 className="font-mono text-mono-label uppercase text-muted">{dayLabel(group.date)}</h2>
                {group.spent > 0 && (
                  <span className="text-body-sm text-muted">
                    Spent <Money amount={group.spent} />
                  </span>
                )}
              </div>
              <ul className="divide-y divide-border overflow-hidden rounded-card border border-border bg-surface shadow-card">
                {group.items.map((t) => (
                  <TransactionRow
                    key={t.id}
                    t={t}
                    category={categories.data?.find((c) => c.id === t.categoryId)}
                    accountName={accountName}
                    onOpen={() => navigate(`/transactions/${t.id}/edit`)}
                    onLongPress={() => setDeleting(t)}
                  />
                ))}
              </ul>
            </section>
          ))}

          {list.hasNextPage && (
            <Button variant="secondary" className="w-full" disabled={list.isFetchingNextPage} onClick={() => list.fetchNextPage()}>
              {list.isFetchingNextPage ? 'Loading…' : 'Load more'}
            </Button>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `Delete ${describe(deleting, accounts.data, categories.data)}?` : ''}
        confirmLabel="Delete"
        busy={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
