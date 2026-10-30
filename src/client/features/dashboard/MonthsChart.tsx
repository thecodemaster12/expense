import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { monthLabel } from '../../../shared/date.ts'
import { compactTaka, formatTaka } from '../../../shared/money.ts'
import type { MonthTotals } from '../../../shared/schemas/summary.ts'

// Validated with the dataviz palette checker (all pass; CVD in the floor band → legend + tooltip + table carry identity).
const series = [
  { key: 'income', label: 'Income', color: 'var(--color-cat-green)' },
  { key: 'spent', label: 'Spent', color: 'var(--color-expense)' },
  { key: 'saved', label: 'Saved', color: 'var(--color-cat-indigo)' },
] as const

const tick = { fill: 'var(--color-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }

/** The two props Recharts passes that we read. */
type TooltipBits = { active?: boolean; payload?: ReadonlyArray<{ payload?: unknown }> }

function MonthTooltip({ active, payload }: TooltipBits) {
  const m = payload?.[0]?.payload as MonthTotals | undefined
  if (!active || !m) return null
  return (
    <div className="rounded-input border border-border bg-surface px-3 py-2 shadow-pop">
      <p className="mb-1 text-body-sm text-muted">{monthLabel(m.month)}</p>
      {series.map((s) => (
        <p key={s.key} className="flex items-center gap-2 text-body-sm">
          <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} aria-hidden />
          <span className="font-mono font-semibold">{formatTaka(m[s.key])}</span>
          <span className="text-muted">{s.label}</span>
        </p>
      ))}
    </div>
  )
}

/** Income / spent / saved for the selected month and the 5 before it. One axis; saved can dip below 0. */
export function MonthsChart({ totals }: { totals: MonthTotals[] }) {
  const data = totals.map((m) => ({ ...m, label: monthLabel(m.month).slice(0, 3) }))

  return (
    <section className="rounded-card border border-border bg-surface p-4 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-title">Last 6 months</h2>
        <ul className="flex gap-4" aria-label="Legend">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-1.5 text-body-sm text-secondary">
              <span className="size-2.5 rounded-[2px]" style={{ background: s.color }} aria-hidden />
              {s.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 h-56" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2} barCategoryGap="28%" margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={tick} />
            <YAxis tickFormatter={compactTaka} tickLine={false} axisLine={false} tick={tick} width={52} />
            <ReferenceLine y={0} stroke="var(--color-border-input)" />
            <Tooltip content={MonthTooltip} cursor={{ fill: 'var(--color-surface-muted)' }} />
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table view: the same numbers for screen readers. */}
      <table className="sr-only">
        <caption>Income, spent and saved per month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {totals.map((m) => (
            <tr key={m.month}>
              <th scope="row">{monthLabel(m.month)}</th>
              {series.map((s) => (
                <td key={s.key}>{formatTaka(m[s.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
