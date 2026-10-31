import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router'
import { addMonths, monthOf, todayDhaka } from '../../../shared/date.ts'
import { month as monthSchema } from '../../../shared/schemas/common.ts'
import { accountsQuery, categoriesQuery, monthTotalsQuery, summaryQuery } from '../../lib/queries.ts'
import { AccountCard } from '../../ui/AccountCard.tsx'
import { MonthSwitcher } from '../../ui/MonthSwitcher.tsx'
import { CategoryBreakdown } from './CategoryBreakdown.tsx'
import { MonthsChart } from './MonthsChart.tsx'
import { StatCards } from './StatCards.tsx'

export function DashboardPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('month')
  const month = raw && monthSchema.safeParse(raw).success ? raw : monthOf(todayDhaka())
  const setMonth = (m: string) => setParams({ month: m }, { replace: true })

  const summary = useQuery(summaryQuery(month))
  const totals = useQuery(monthTotalsQuery(addMonths(month, -5), month))
  const accounts = useQuery(accountsQuery)
  const categories = useQuery(categoriesQuery)
  const active = (accounts.data ?? []).filter((a) => !a.archived).sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-headline-sm lg:text-headline">Dashboard</h1>
        <MonthSwitcher month={month} onChange={setMonth} />
      </div>

      {/* one sideways-scrolling row at every size, so more accounts never push the page down */}
      <section className="min-w-0">
        <div className="mb-2 flex items-baseline justify-between px-1">
          <h2 className="text-title">Accounts</h2>
          <Link to="/accounts" className="text-label font-semibold text-primary">
            See all
          </Link>
        </div>
        <div className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0">
          {active.map((a) => (
            <Link key={a.id} to="/accounts" className="w-44 shrink-0 snap-start rounded-card lg:w-[calc((100%-2.25rem)/4)]">
              <AccountCard account={a} compact className="hover:bg-canvas" />
            </Link>
          ))}
        </div>
      </section>

      {summary.isError && <p className="text-expense">Couldn't load this month. Check your connection.</p>}

      {/* grid-cols-1 = minmax(0,1fr): keeps wide children from widening the column */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* phones: stats first, then the donut; desktop: stats move to the right column */}
        <div className="lg:order-last">
          <StatCards summary={summary.data} />
        </div>
        <div className="min-w-0 lg:col-span-2">
          {summary.data && categories.data ? (
            <CategoryBreakdown summary={summary.data} categories={categories.data} month={month} />
          ) : (
            <p className="text-muted">Loading…</p>
          )}
        </div>
      </div>

      {totals.data ? <MonthsChart totals={totals.data} /> : <p className="text-muted">Loading…</p>}
    </div>
  )
}
