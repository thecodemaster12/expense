import { formatTaka } from '../../../shared/money.ts'

type Props = { value: string; onChange: (digits: string) => void; invalid: boolean }

/** Big amount field: numeric keypad, digits only, shown with lakh commas as you type. */
export function AmountInput({ value, onChange, invalid }: Props) {
  return (
    <div className="flex items-baseline gap-2 border-b-2 border-border-input pb-1 focus-within:border-primary">
      <span className="font-mono text-display-sm text-muted lg:text-display">৳</span>
      <input
        autoFocus
        inputMode="numeric"
        autoComplete="off"
        aria-label="Amount"
        aria-invalid={invalid}
        placeholder="0"
        value={value ? formatTaka(Number(value)).slice(1) : ''}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 12))}
        className="w-full bg-transparent font-mono text-display-sm outline-none placeholder:text-border-input lg:text-display"
      />
    </div>
  )
}
