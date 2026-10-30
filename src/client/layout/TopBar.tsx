import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { longDateLabel, todayDhaka } from '../../shared/date.ts'
import { meQuery } from '../lib/queries.ts'
import { ProfileMenu } from './ProfileMenu.tsx'

/** Greeting + today (Dhaka) on the left; Log Transaction (desktop) and the avatar menu on the right. */
export function TopBar() {
  const me = useQuery(meQuery)
  const firstName = me.data?.name.split(/\s+/)[0]

  return (
    <header className="px-gutter mx-auto flex w-full max-w-5xl items-center justify-between gap-3 pt-4">
      <div className="min-w-0">
        <p className="truncate text-title">{firstName ? `Hey, ${firstName}` : 'Hey'} 👋</p>
        <p className="truncate text-body-sm text-muted">{longDateLabel(todayDhaka())}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Link
          to="/add"
          className="hidden h-10 items-center gap-2 rounded-input bg-primary px-4 text-label font-semibold text-white hover:bg-primary-hover lg:inline-flex"
        >
          <Plus size={18} aria-hidden /> Log Transaction
        </Link>
        <ProfileMenu />
      </div>
    </header>
  )
}
