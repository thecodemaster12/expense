import { ArrowDownLeft, ArrowUpRight, Percent, PiggyBank, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Summary } from '../../../shared/schemas/summary.ts'
import { Money } from '../../ui/Money.tsx'

function Stat({ label, icon: Icon, tone, children }: { label: string; icon: LucideIcon; tone: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-mono-label uppercase text-muted">{label}</p>
        <span className={`grid size-7 shrink-0 place-items-center rounded-input ${tone}`} aria-hidden>
          <Icon size={15} />
        </span>
      </div>
      <div className="mt-2 font-mono text-money-lg">{children}</div>
    </div>
  )
}

/** Income · Spent · Saved · Savings %. Values in ink; the small icon tile carries the meaning. */
export function StatCards({ summary }: { summary: Summary | undefined }) {
  const s = summary
  const dash = <span className="text-muted">—</span>
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat label="Income" icon={ArrowDownLeft} tone="bg-income-soft text-primary">
        {s ? <Money amount={s.income} /> : dash}
      </Stat>
      <Stat label="Spent" icon={ArrowUpRight} tone="bg-expense-soft text-expense">
        {s ? <Money amount={s.spent} /> : dash}
      </Stat>
      <Stat label="Saved" icon={PiggyBank} tone="bg-transfer-soft text-transfer">
        {s ? <Money amount={s.saved} className={s.saved < 0 ? 'text-expense' : ''} /> : dash}
      </Stat>
      <Stat label="Savings" icon={Percent} tone="bg-surface-muted text-secondary">
        {s && s.income > 0 ? `${Math.round(s.savingsRate * 100)}%` : dash}
      </Stat>
    </div>
  )
}
