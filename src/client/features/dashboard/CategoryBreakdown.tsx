import { Link } from 'react-router'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { monthLabel } from '../../../shared/date.ts'
import { formatTaka } from '../../../shared/money.ts'
import type { Category } from '../../../shared/schemas/category.ts'
import type { Summary } from '../../../shared/schemas/summary.ts'
import { Money } from '../../ui/Money.tsx'
import { paletteClasses, paletteVar } from '../../ui/palette.ts'

type Row = Summary['byCategory'][number] & { color: Category['color'] }

/** The two props Recharts passes that we read. */
type TooltipBits = { active?: boolean; payload?: ReadonlyArray<{ payload?: unknown }> }

function SliceTooltip({ active, payload }: TooltipBits) {
  const row = payload?.[0]?.payload as Row | undefined
  if (!active || !row) return null
  return (
    <div className="rounded-input border border-border bg-surface px-3 py-2 shadow-pop">
      <p className="font-mono text-money font-semibold">{formatTaka(row.amount)}</p>
      <p className="text-body-sm text-muted">
        {row.category} · {Math.round(row.share * 100)}%
      </p>
    </div>
  )
}

/** Donut of spending by category (each in its stored color) + the list that doubles as its legend. */
export function CategoryBreakdown({ summary, categories, month }: { summary: Summary; categories: Category[]; month: string }) {
  const rows: Row[] = summary.byCategory.map((r) => ({
    ...r,
    color: categories.find((c) => c.id === r.categoryId)?.color ?? 'gray',
  }))

  return (
    <section className="rounded-card border border-border bg-surface p-4 shadow-card">
      <h2 className="text-title">Where it went</h2>

      {rows.length === 0 ? (
        <p className="mt-2 text-body text-muted">No spending in {monthLabel(month)}.</p>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative size-44 shrink-0">
            <PieChart width={176} height={176} accessibilityLayer>
              <Pie
                data={rows}
                dataKey="amount"
                nameKey="category"
                innerRadius={58}
                outerRadius={86}
                stroke="var(--color-surface)"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {rows.map((r) => (
                  <Cell key={r.categoryId} fill={paletteVar(r.color)} />
                ))}
              </Pie>
              <Tooltip content={SliceTooltip} />
            </PieChart>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-mono text-mono-label uppercase text-muted">Spent</p>
                <Money amount={summary.spent} className="text-money font-semibold" />
              </div>
            </div>
          </div>

          <ul className="w-full divide-y divide-border">
            {rows.map((r) => (
              <li key={r.categoryId}>
                <Link
                  to={`/transactions?month=${month}&category=${r.categoryId}`}
                  className="-mx-2 flex items-center gap-3 rounded-input px-2 py-2 hover:bg-surface-muted"
                >
                  <span className={`size-2.5 shrink-0 rounded-full ${paletteClasses[r.color].dot}`} aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-body">{r.category}</span>
                  <Money amount={r.amount} className="text-money" />
                  <span className="w-10 text-right font-mono text-body-sm text-muted">{Math.round(r.share * 100)}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
