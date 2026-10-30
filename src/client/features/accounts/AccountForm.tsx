import { useState, type FormEvent } from 'react'
import type { AccountIcon } from '../../../shared/schemas/account.ts'
import type { Color } from '../../../shared/schemas/common.ts'
import { formatTaka, parseSignedTaka } from '../../../shared/money.ts'
import { Button } from '../../ui/Button.tsx'
import { AccountIconTile } from '../../ui/AccountIconTile.tsx'
import { ColorPicker } from '../../ui/ColorPicker.tsx'
import { Field } from '../../ui/Field.tsx'
import { Input } from '../../ui/Input.tsx'
import { IconPicker } from './IconPicker.tsx'

export type AccountValues = { name: string; openingBalance: number; color: Color; icon: AccountIcon }

type Props = {
  initial: AccountValues
  submitLabel: string
  saving: boolean
  serverErrors: Record<string, string>
  onSubmit: (values: AccountValues) => void
  onCancel: () => void
}

/** Add/edit form shown inline in a card. */
export function AccountForm({ initial, submitLabel, saving, serverErrors, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial.name)
  const [opening, setOpening] = useState(initial.openingBalance ? formatTaka(initial.openingBalance).replace('৳', '') : '')
  const [color, setColor] = useState(initial.color)
  const [icon, setIcon] = useState(initial.icon)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const errors = { ...serverErrors, ...clientErrors }

  function submit(e: FormEvent) {
    e.preventDefault()
    const openingBalance = opening.trim() === '' ? 0 : parseSignedTaka(opening)
    const found: Record<string, string> = {}
    if (!name.trim()) found.name = 'Enter a name'
    if (openingBalance === null) found.openingBalance = 'Whole taka only, e.g. 5,000 or -2,000'
    setClientErrors(found)
    if (Object.keys(found).length === 0 && openingBalance !== null) onSubmit({ name: name.trim(), openingBalance, color, icon })
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field label="Name" error={errors.name}>
        <Input autoFocus aria-label="Account name" maxLength={40} value={name} aria-invalid={!!errors.name} onChange={(e) => setName(e.target.value)} className="w-full" />
      </Field>
      <Field label="Opening balance" error={errors.openingBalance}>
        <Input
          aria-label="Opening balance"
          placeholder="0"
          value={opening}
          aria-invalid={!!errors.openingBalance}
          onChange={(e) => setOpening(e.target.value)}
          className="w-full font-mono"
        />
        <p className="mt-1.5 text-body-sm text-muted">What it held the day you started tracking. Use a minus for money owed.</p>
      </Field>
      <div className="flex items-center gap-3 rounded-input bg-surface-muted p-3">
        <AccountIconTile icon={icon} color={color} />
        <span className="truncate text-title">{name.trim() || 'Preview'}</span>
      </div>
      <Field label="Icon">
        <IconPicker value={icon} onChange={setIcon} />
      </Field>
      <Field label="Color">
        <ColorPicker value={color} onChange={setColor} />
      </Field>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
