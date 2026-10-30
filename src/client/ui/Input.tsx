import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

const base =
  'h-11 rounded-input border border-border-input bg-surface px-3 text-body focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 aria-invalid:border-expense'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${base} ${className}`} />
}

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${base} ${className}`} />
}
