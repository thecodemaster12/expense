import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { formatTaka } from '../../../shared/money.ts'
import type { Transaction } from '../../../shared/schemas/transaction.ts'
import * as api from '../../lib/api.ts'
import { accountsQuery, categoriesQuery, invalidateMoney } from '../../lib/queries.ts'
import { useToast } from '../../ui/toast-context.ts'
import { newForm } from './form.ts'
import { lastAccountId, rememberAccount } from './lastAccount.ts'
import { TransactionForm } from './TransactionForm.tsx'

export function AddPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const toast = useToast()
  const accounts = useQuery(accountsQuery)
  const categories = useQuery(categoriesQuery)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

  // Opened directly (no history in this app): go home instead of leaving the site.
  const close = () => (location.key === 'default' ? navigate('/') : navigate(-1))

  const nameOf = (list: { id: number; name: string }[] | undefined, id: number | null) =>
    list?.find((x) => x.id === id)?.name ?? ''

  function savedMessage(t: Transaction) {
    if (t.type === 'transfer') {
      return `Moved ${formatTaka(t.amount)} · ${nameOf(accounts.data, t.accountId)} → ${nameOf(accounts.data, t.toAccountId)}`
    }
    return `Saved ${formatTaka(t.amount)} · ${nameOf(categories.data, t.categoryId)}`
  }

  function undo(id: number) {
    api
      .deleteTransaction(id)
      .then(() => invalidateMoney(queryClient))
      .then(() => toast({ message: 'Undone' }))
      .catch(() => toast({ message: "Couldn't undo. Delete it from Transactions." }))
  }

  const save = useMutation({
    mutationFn: api.createTransaction,
    onSuccess: (t) => {
      rememberAccount(t.accountId)
      void invalidateMoney(queryClient)
      toast({ message: savedMessage(t), action: { label: 'Undo', onClick: () => undo(t.id) } })
      close()
    },
    onError: (e) => {
      if (e instanceof api.ApiError && e.status === 400) setServerErrors(e.fields)
      else toast({ message: "Couldn't save. Try again." })
    },
  })

  return (
    <>
      <div className="flex max-w-md items-center justify-between">
        <h1 className="text-headline-sm lg:text-headline">Add</h1>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-muted"
        >
          <X size={22} aria-hidden />
        </button>
      </div>

      {accounts.data && categories.data ? (
        <TransactionForm
          accounts={accounts.data}
          categories={categories.data}
          initial={newForm(accounts.data, lastAccountId())}
          saving={save.isPending}
          serverErrors={serverErrors}
          submitLabel="Save"
          onSubmit={(input) => {
            setServerErrors({})
            save.mutate(input)
          }}
        />
      ) : accounts.isError || categories.isError ? (
        <p className="mt-4 text-expense">Couldn't load accounts. Check your connection and reopen.</p>
      ) : (
        <p className="mt-4 text-muted">Loading…</p>
      )}
    </>
  )
}
