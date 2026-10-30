import type { ReactNode } from 'react'
import type { Account } from '../../shared/schemas/account.ts'
import { AccountIconTile } from './AccountIconTile.tsx'
import { Money } from './Money.tsx'

type Props = { account: Account; compact?: boolean; className?: string; children?: ReactNode }

/**
 * Balance card with the account's icon tile. `children` = actions in the top-right corner.
 * `compact` (Dashboard): one short row — tile, then name over balance.
 */
export function AccountCard({ account, compact, className = '', children }: Props) {
  const balance = (
    <Money
      amount={account.balance}
      className={`block ${compact ? 'text-money' : 'mt-3 text-money-lg'} ${account.balance < 0 ? 'text-expense' : ''}`}
    />
  )

  if (compact) {
    return (
      <div className={`flex items-center gap-3 rounded-card border border-border bg-surface p-3 shadow-card ${className}`}>
        <AccountIconTile icon={account.icon} color={account.color} small />
        <div className="min-w-0">
          <p className="truncate text-label text-secondary">{account.name}</p>
          {balance}
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-card border border-border bg-surface p-4 shadow-card ${className}`}>
      <div className="flex items-start gap-3">
        <AccountIconTile icon={account.icon} color={account.color} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-title">{account.name}</p>
          <p className="text-body-sm text-muted">
            Opening <Money amount={account.openingBalance} />
          </p>
        </div>
        {children}
      </div>
      {balance}
    </div>
  )
}
