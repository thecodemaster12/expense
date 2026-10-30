import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import type { TransactionInput } from '../../../shared/schemas/transaction.ts'
import * as api from '../../lib/api.ts'
import { accountsQuery, categoriesQuery, invalidateMoney } from '../../lib/queries.ts'
import { Button } from '../../ui/Button.tsx'
import { ConfirmDialog } from '../../ui/ConfirmDialog.tsx'
import { useToast } from '../../ui/toast-context.ts'
import { FormHeader } from './FormHeader.tsx'
import { useClose } from './useClose.ts'
import { fromTransaction } from './form.ts'
import { describe } from './list.ts'
import { TransactionForm } from './TransactionForm.tsx'

export function EditPage() {
  const id = Number(useParams().id)
  const close = useClose('/transactions')
  const queryClient = useQueryClient()
  const toast = useToast()
  const accounts = useQuery(accountsQuery)
  const categories = useQuery(categoriesQuery)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [confirming, setConfirming] = useState(false)

  const remove = useMutation({
    mutationFn: () => api.deleteTransaction(id),
    onSuccess: () => {
      toast({ message: `Deleted ${describe(tx.data!, accounts.data, categories.data)}` })
      close()
      void invalidateMoney(queryClient)
    },
    onError: () => toast({ message: "Couldn't delete. Try again." }),
  })

  // Stop fetching once deleted, so the page doesn't flash "not found" on its way out.
  const tx = useQuery({
    queryKey: ['transactions', 'one', id],
    queryFn: () => api.getTransaction(id),
    enabled: Number.isInteger(id) && !remove.isSuccess,
    retry: false,
  })

  const save = useMutation({
    mutationFn: (input: TransactionInput) => api.updateTransaction(id, input),
    onSuccess: (t) => {
      void invalidateMoney(queryClient)
      toast({ message: `Updated ${describe(t, accounts.data, categories.data)}` })
      close()
    },
    onError: (e) => {
      if (e instanceof api.ApiError && e.status === 400) setServerErrors(e.fields)
      else toast({ message: "Couldn't save. Try again." })
    },
  })

  if (tx.isError || !Number.isInteger(id)) {
    return (
      <>
        <FormHeader title="Edit" onClose={close} />
        <p className="mt-4 text-muted">
          This entry doesn't exist anymore.{' '}
          <Link to="/transactions" className="font-semibold text-primary underline">
            Back to Transactions
          </Link>
        </p>
      </>
    )
  }

  return (
    <>
      <FormHeader title="Edit" onClose={close} />
      {tx.data && accounts.data && categories.data ? (
        <div className="max-w-md">
          <TransactionForm
            accounts={accounts.data}
            categories={categories.data}
            initial={fromTransaction(tx.data)}
            saving={save.isPending}
            serverErrors={serverErrors}
            submitLabel="Save changes"
            onSubmit={(input) => {
              setServerErrors({})
              save.mutate(input)
            }}
          />
          <Button variant="secondary" className="mt-3 w-full text-expense" onClick={() => setConfirming(true)}>
            <Trash2 size={16} aria-hidden /> Delete
          </Button>
          <ConfirmDialog
            open={confirming}
            title={`Delete ${describe(tx.data, accounts.data, categories.data)}?`}
            confirmLabel="Delete"
            busy={remove.isPending}
            onConfirm={() => remove.mutate()}
            onCancel={() => setConfirming(false)}
          />
        </div>
      ) : (
        <p className="mt-4 text-muted">Loading…</p>
      )}
    </>
  )
}
