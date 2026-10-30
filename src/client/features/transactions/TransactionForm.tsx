import { useState, type FormEvent } from 'react'
import { addDays, todayDhaka } from '../../../shared/date.ts'
import type { Account } from '../../../shared/schemas/account.ts'
import type { Category } from '../../../shared/schemas/category.ts'
import { fieldErrors } from '../../../shared/schemas/common.ts'
import { transactionInput, type TransactionInput, type TransactionType } from '../../../shared/schemas/transaction.ts'
import { Button } from '../../ui/Button.tsx'
import { Chip } from '../../ui/Chip.tsx'
import { Field } from '../../ui/Field.tsx'
import { Input } from '../../ui/Input.tsx'
import { SegmentedControl } from '../../ui/SegmentedControl.tsx'
import { AmountInput } from './AmountInput.tsx'
import { categoriesFor, changeType, toInput, type FormState } from './form.ts'

const types: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
]

type Props = {
  accounts: Account[]
  categories: Category[]
  initial: FormState
  saving: boolean
  /** Field errors from the API; shown until the next submit. */
  serverErrors: Record<string, string>
  submitLabel: string
  onSubmit: (input: TransactionInput) => void
}

/** Shared by Add and Edit. */
export function TransactionForm({ accounts, categories, initial, saving, serverErrors, submitLabel, onSubmit }: Props) {
  const [form, setForm] = useState(initial)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const errors = { ...serverErrors, ...clientErrors }
  const set = (patch: Partial<FormState>) => {
    setForm((f) => ({ ...f, ...patch }))
    // An error goes away as soon as its field is touched.
    setClientErrors((e) => Object.fromEntries(Object.entries(e).filter(([key]) => !(key in patch))))
  }

  // Archived accounts stay visible only if this entry already uses them (editing old entries).
  const active = accounts.filter((a) => !a.archived || a.id === initial.accountId || a.id === initial.toAccountId)
  const transfer = form.type === 'transfer'
  const today = todayDhaka()
  const yesterday = addDays(today, -1)

  function submit(e: FormEvent) {
    e.preventDefault()
    const result = transactionInput.safeParse(toInput(form))
    if (!result.success) return setClientErrors(fieldErrors(result.error))
    setClientErrors({})
    onSubmit(result.data)
  }

  return (
    <form onSubmit={submit} noValidate className="mt-4 max-w-md space-y-6">
      <SegmentedControl label="Type" options={types} value={form.type} onChange={(t) => setForm((f) => changeType(f, t, categories))} />

      <Field label="Amount" error={errors.amount}>
        <AmountInput value={form.amount} invalid={!!errors.amount} onChange={(amount) => set({ amount })} />
      </Field>

      {!transfer && (
        <Field label="Category" error={errors.categoryId}>
          <div className="flex flex-wrap gap-2">
            {categoriesFor(categories, form.type, initial.categoryId).map((c) => (
              <Chip key={c.id} selected={form.categoryId === c.id} onClick={() => set({ categoryId: c.id })}>
                {c.name}
              </Chip>
            ))}
          </div>
        </Field>
      )}

      <Field label={transfer ? 'From' : 'Account'} error={errors.accountId}>
        <div className="flex flex-wrap gap-2">
          {active.map((a) => (
            <Chip
              key={a.id}
              selected={form.accountId === a.id}
              onClick={() => set({ accountId: a.id, toAccountId: form.toAccountId === a.id ? null : form.toAccountId })}
            >
              {a.name}
            </Chip>
          ))}
        </div>
      </Field>

      {transfer && (
        <Field label="To" error={errors.toAccountId}>
          <div className="flex flex-wrap gap-2">
            {active.map((a) => (
              <Chip key={a.id} selected={form.toAccountId === a.id} disabled={form.accountId === a.id} onClick={() => set({ toAccountId: a.id })}>
                {a.name}
              </Chip>
            ))}
          </div>
        </Field>
      )}

      <Field label="Date" error={errors.date}>
        <div className="flex flex-wrap items-center gap-2">
          <Chip selected={form.date === today} onClick={() => set({ date: today })}>
            Today
          </Chip>
          <Chip selected={form.date === yesterday} onClick={() => set({ date: yesterday })}>
            Yesterday
          </Chip>
          <Input type="date" aria-label="Pick a date" value={form.date} onChange={(e) => set({ date: e.target.value })} />
        </div>
      </Field>

      <Field label="Note (optional)" error={errors.note}>
        <Input
          aria-label="Note"
          value={form.note}
          maxLength={200}
          placeholder="e.g. Groceries"
          onChange={(e) => set({ note: e.target.value })}
          className="w-full"
        />
      </Field>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
