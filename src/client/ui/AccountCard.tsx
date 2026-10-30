import type { ReactNode } from 'react'
import type { Account } from '../../shared/schemas/account.ts'
import { AccountIconTile } from './AccountIconTile.tsx'
import { Money } from './Money.tsx'

type Props = { account: Account; compact?: boolean; className?: string; children?: ReactNode }

/** Balance card with the account's icon tile. `children` = actions in the top-right corner. */
export function AccountCard({ account, compact, className = '', children }: Props) {
  return (
    <div className={`rounded-card border border-border bg-surface p-4 shadow-card ${className}`}>
      <div className="flex items-start gap-3">
        <AccountIconTile icon={account.icon} color={account.color} small={compact} />
        <div className="min-w-0 flex-1">
          <p className={`truncate ${compact ? 'text-label text-secondary' : 'text-title'}`}>{account.name}</p>
          {!compact && (
            <p className="text-body-sm text-muted">
              Opening <Money amount={account.openingBalance} />
            </p>
          )}
        </div>
        {children}
      </div>
      <Money
        amount={account.balance}
        className={`mt-3 block ${compact ? 'text-money' : 'text-money-lg'} ${account.balance < 0 ? 'text-expense' : ''}`}
      />
    </div>
  )
}
