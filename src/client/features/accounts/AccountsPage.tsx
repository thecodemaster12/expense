import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Archive, ArchiveRestore, Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Account } from '../../../shared/schemas/account.ts'
import { nextColor } from '../../../shared/schemas/common.ts'
import * as api from '../../lib/api.ts'
import { accountsQuery, invalidateMoney } from '../../lib/queries.ts'
import { AccountCard } from '../../ui/AccountCard.tsx'
import { Button } from '../../ui/Button.tsx'
import { Money } from '../../ui/Money.tsx'
import { useToast } from '../../ui/toast-context.ts'
import { AccountForm, type AccountValues } from './AccountForm.tsx'

const iconButton = 'grid size-9 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-secondary'
const card = 'rounded-card border border-border bg-surface p-4 shadow-card'

export function AccountsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const accounts = useQuery(accountsQuery)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

  const all = [...(accounts.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
  const active = all.filter((a) => !a.archived)
  const archived = all.filter((a) => a.archived)
  const total = all.reduce((sum, a) => sum + a.balance, 0) // archived money still exists

  const onError = (e: unknown) => {
    if (e instanceof api.ApiError && e.status === 400) {
      if (e.fields.form) toast({ message: e.fields.form })
      setServerErrors(e.fields)
    } else toast({ message: "Couldn't save. Try again." })
  }

  const create = useMutation({
    mutationFn: (values: AccountValues) => api.createAccount(values),
    onSuccess: (a) => {
      void invalidateMoney(queryClient)
      toast({ message: `Added ${a.name}` })
      setAdding(false)
    },
    onError,
  })

  const update = useMutation({
    mutationFn: ({ id, values }: { id: number; values: AccountValues }) => api.updateAccount(id, values),
    onSuccess: (a) => {
      void invalidateMoney(queryClient)
      toast({ message: `Saved ${a.name}` })
      setEditingId(null)
    },
    onError,
  })

  const setArchived = useMutation({
    mutationFn: ({ account, archived }: { account: Account; archived: boolean }) => api.updateAccount(account.id, { archived }),
    onSuccess: (a, { archived }) => {
      void invalidateMoney(queryClient)
      toast({
        message: archived ? `Archived ${a.name}` : `Restored ${a.name}`,
        action: archived ? { label: 'Undo', onClick: () => setArchived.mutate({ account: a, archived: false }) } : undefined,
      })
    },
    onError,
  })

  function startAdding() {
    setServerErrors({})
    setEditingId(null)
    setAdding(true)
  }

  function startEditing(id: number) {
    setServerErrors({})
    setAdding(false)
    setEditingId(id)
  }

  if (accounts.isPending) return <p className="text-muted">Loading…</p>
  if (accounts.isError) return <p className="text-expense">Couldn't load accounts. Check your connection.</p>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-headline-sm lg:text-headline">Accounts</h1>
        {!adding && (
          <Button variant="secondary" onClick={startAdding}>
            <Plus size={16} aria-hidden /> Add account
          </Button>
        )}
      </div>

      <section className={card}>
        <p className="font-mono text-mono-label uppercase text-muted">Total balance</p>
        <Money amount={total} className={`mt-1 block text-display-sm lg:text-display ${total < 0 ? 'text-expense' : ''}`} />
        <p className="mt-1 text-body-sm text-muted">
          Across {all.length} {all.length === 1 ? 'account' : 'accounts'}
        </p>
      </section>

      {adding && (
        <section className={card}>
          <h2 className="mb-4 text-title">New account</h2>
          <AccountForm
            initial={{ name: '', openingBalance: 0, color: nextColor(all.map((a) => a.color)), icon: 'wallet' }}
            submitLabel="Add account"
            saving={create.isPending}
            serverErrors={serverErrors}
            onSubmit={(values) => create.mutate(values)}
            onCancel={() => setAdding(false)}
          />
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {active.map((a) =>
          editingId === a.id ? (
            <section key={a.id} className={`${card} sm:col-span-2`}>
              <h2 className="mb-4 text-title">Edit {a.name}</h2>
              <AccountForm
                initial={a}
                submitLabel="Save"
                saving={update.isPending}
                serverErrors={serverErrors}
                onSubmit={(values) => update.mutate({ id: a.id, values })}
                onCancel={() => setEditingId(null)}
              />
            </section>
          ) : (
            <AccountCard key={a.id} account={a}>
              <div className="-mt-1 flex">
                <button type="button" aria-label={`Edit ${a.name}`} className={iconButton} onClick={() => startEditing(a.id)}>
                  <Pencil size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Archive ${a.name}`}
                  className={iconButton}
                  onClick={() => setArchived.mutate({ account: a, archived: true })}
                >
                  <Archive size={16} aria-hidden />
                </button>
              </div>
            </AccountCard>
          ),
        )}
      </div>

      {archived.length > 0 && (
        <section>
          <h2 className="mb-2 px-1 font-mono text-mono-label uppercase text-muted">Archived · hidden from Add</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {archived.map((a) => (
              <AccountCard key={a.id} account={a} className="opacity-70">
                <button
                  type="button"
                  aria-label={`Restore ${a.name}`}
                  className={`${iconButton} -mt-1`}
                  onClick={() => setArchived.mutate({ account: a, archived: false })}
                >
                  <ArchiveRestore size={16} aria-hidden />
                </button>
              </AccountCard>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
