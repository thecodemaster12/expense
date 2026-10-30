import { useQuery } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { meQuery } from '../lib/queries.ts'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')

/**
 * Top-right avatar; tap for name, email and Sign out.
 * Placeholder data until Cloudflare Access (Phase 3); Sign out then points to /cdn-cgi/access/logout.
 */
export function ProfileMenu() {
  const me = useQuery(meQuery)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // close on outside click or Esc
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!me.data) return <span className="size-9" />

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Profile: ${me.data.name}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center rounded-full bg-primary text-label font-semibold text-white hover:bg-primary-hover"
      >
        {initials(me.data.name)}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-64 rounded-card border border-border bg-surface p-4 shadow-pop">
          <p className="truncate text-label font-semibold">{me.data.name}</p>
          <p className="truncate text-body-sm text-muted">{me.data.email}</p>
          <button
            type="button"
            disabled
            title="Sign out works once Cloudflare Access is set up (Phase 3)"
            className="mt-3 flex h-10 w-full items-center gap-2 rounded-input px-2 text-label text-secondary disabled:opacity-50"
          >
            <LogOut size={16} aria-hidden /> Sign out
            <span className="ml-auto text-body-sm text-muted">Phase 3</span>
          </button>
        </div>
      )}
    </div>
  )
}
