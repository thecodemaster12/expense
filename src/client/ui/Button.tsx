import type { ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'border border-border bg-surface-muted text-secondary hover:bg-border',
  danger: 'bg-expense text-white hover:opacity-90',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-input px-4 text-label font-semibold disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  )
}
