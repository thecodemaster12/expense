import { X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

// Placeholder until the Add step (plan.md Phase 1).
export function AddPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // Opened directly (no history in this app): go home instead of leaving the site.
  const close = () => (location.key === 'default' ? navigate('/') : navigate(-1))

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-headline-sm lg:text-headline">Add</h1>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-muted"
        >
          <X size={22} aria-hidden />
        </button>
      </div>
      <p className="mt-2 text-muted">Coming soon.</p>
    </>
  )
}
