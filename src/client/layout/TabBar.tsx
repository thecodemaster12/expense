import { Plus } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router'
import { navItems, type NavItem } from './nav.ts'

function Tab({ to, label, icon: Icon, end }: NavItem) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex min-h-14 flex-col items-center justify-center gap-0.5 text-body-sm ${
            isActive ? 'font-semibold text-primary' : 'text-muted'
          }`
        }
      >
        <Icon size={22} aria-hidden />
        {label}
      </NavLink>
    </li>
  )
}

/** Mobile bottom bar: Dashboard · Transactions · + · Accounts · Settings. Hidden on the Add screen. */
export function TabBar() {
  if (useLocation().pathname === '/add') return null
  const [dashboard, transactions, accounts, settings] = navItems

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        <Tab {...dashboard} />
        <Tab {...transactions} />
        <li className="flex justify-center">
          <Link
            to="/add"
            aria-label="Add transaction"
            className="-mt-5 grid size-14 place-items-center rounded-full bg-primary text-white shadow-pop hover:bg-primary-hover"
          >
            <Plus size={26} aria-hidden />
          </Link>
        </li>
        <Tab {...accounts} />
        <Tab {...settings} />
      </ul>
    </nav>
  )
}
