import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import * as api from '../../lib/api.ts'
import { accountsQuery, categoriesQuery, invalidateMoney } from '../../lib/queries.ts'
import { useToast } from '../../ui/toast-context.ts'
import { FormHeader } from './FormHeader.tsx'
import { useClose } from './useClose.ts'
import { newForm } from './form.ts'
import { lastAccountId, rememberAccount } from './lastAccount.ts'
import { describe } from './list.ts'
import { TransactionForm } from './TransactionForm.tsx'

export function AddPage() {
  const close = useClose()
  const queryClient = useQueryClient()
  const toast = useToast()
  const accounts = useQuery(accountsQuery)
  const categories = useQuery(categoriesQuery)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

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
      const verb = t.type === 'transfer' ? 'Moved' : 'Saved'
      toast({
        message: `${verb} ${describe(t, accounts.data, categories.data)}`,
        action: { label: 'Undo', onClick: () => undo(t.id) },
      })
      close()
    },
    onError: (e) => {
      if (e instanceof api.ApiError && e.status === 400) setServerErrors(e.fields)
      else toast({ message: "Couldn't save. Try again." })
    },
  })

  return (
    <>
      <FormHeader title="Add" onClose={close} />
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
