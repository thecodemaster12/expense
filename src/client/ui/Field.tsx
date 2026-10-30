import type { ReactNode } from 'react'

/** A labelled group with its inline error underneath (never an alert). */
export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2 font-mono text-mono-label uppercase text-muted">{label}</p>
      {children}
      {error && <p className="mt-1.5 text-body-sm text-expense">{error}</p>}
    </div>
  )
}
