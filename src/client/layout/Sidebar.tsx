import { Plus } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { navItems } from './nav.ts'

/** Desktop left rail (≥1024px). */
export function Sidebar() {
  return (
    // fixed (not sticky): always spans the full window height, however long the page is
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col overflow-y-auto border-r border-border bg-surface p-4 lg:flex">
      <p className="px-2 text-title">Shompod</p>

      <Link
        to="/add"
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-input bg-primary text-label font-semibold text-white hover:bg-primary-hover"
      >
        <Plus size={18} aria-hidden /> Log Transaction
      </Link>

      <nav aria-label="Main" className="mt-6">
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex h-10 items-center gap-3 rounded-input px-2 text-body ${
                    isActive ? 'bg-surface-muted font-semibold text-primary' : 'text-secondary hover:bg-surface-muted'
                  }`
                }
              >
                <Icon size={18} aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-auto px-2 font-mono text-mono-label text-muted">v{__APP_VERSION__}</p>
    </aside>
  )
}
