import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }

/** Pill toggle for pickers (category, account, date shortcuts). */
export function Chip({ selected, className = '', ...props }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...props}
      className={`h-10 rounded-full border px-4 text-label disabled:opacity-40 ${
        selected ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-secondary hover:bg-surface-muted'
      } ${className}`}
    />
  )
}
