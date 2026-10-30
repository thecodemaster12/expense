import { ArrowLeftRight, Wallet } from 'lucide-react'

// Temporary token preview. Replaced by the app shell (plan.md Phase 1).
const swatches = [
  'bg-primary', 'bg-secondary', 'bg-income', 'bg-expense', 'bg-transfer',
  'bg-canvas', 'bg-surface-muted', 'bg-border', 'bg-acc-bkash', 'bg-acc-other',
]

const categories = [
  ['Rent', 'text-cat-rent bg-cat-rent-bg'],
  ['Food', 'text-cat-food bg-cat-food-bg'],
  ['Electricity & Bills', 'text-cat-bills bg-cat-bills-bg'],
  ['Travel', 'text-cat-travel bg-cat-travel-bg'],
  ['Shopping', 'text-cat-shopping bg-cat-shopping-bg'],
  ['Health', 'text-cat-health bg-cat-health-bg'],
  ['Family', 'text-cat-family bg-cat-family-bg'],
  ['Other', 'text-cat-other bg-cat-other-bg'],
]

export default function App() {
  return (
    <main className="px-gutter mx-auto max-w-5xl space-y-6 py-8">
      <h1 className="text-headline-sm lg:text-headline">Shompod tokens</h1>

      <section className="flex flex-wrap gap-2">
        {swatches.map((s) => (
          <div key={s} className="text-center">
            <div className={`size-12 rounded-input border border-border ${s}`} />
            <p className="mt-1 font-mono text-mono-label text-muted">{s.slice(3)}</p>
          </div>
        ))}
      </section>

      <section className="rounded-card border border-border bg-surface p-4 shadow-card">
        <p className="font-mono text-mono-label uppercase text-muted">Monthly income</p>
        <p className="mt-2 font-mono text-money-lg">৳115,000</p>
        <p className="mt-4 font-mono text-display-sm lg:text-display">৳12,500</p>
        <div className="mt-4 flex gap-4 font-mono text-money">
          <span className="text-income">+৳5,000</span>
          <span className="text-expense">−৳3,420</span>
          <span className="inline-flex items-center gap-1 text-transfer">
            <ArrowLeftRight size={14} />৳10,000
          </span>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {categories.map(([name, cls]) => (
          <span key={name} className={`rounded-full px-2.5 py-1 text-label ${cls}`}>{name}</span>
        ))}
      </section>

      <section className="space-y-1">
        <p className="text-title">Title 16/24</p>
        <p className="text-body">Body 14/20 — the quick brown fox.</p>
        <p className="text-body-sm text-muted">Body small 12/16</p>
        <p className="text-label">Label 13/18</p>
      </section>

      <button className="inline-flex h-11 items-center gap-2 rounded-input bg-primary px-4 text-label font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
        <Wallet size={16} /> Primary button
      </button>
    </main>
  )
}
