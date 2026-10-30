import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ToastContext, type Toast } from './toast-context.ts'

const SHOW_MS = 5000

/** One toast at a time, above the mobile tab bar. Lives above the router so it survives navigation. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(Toast & { key: number }) | null>(null)
  const show = useCallback((t: Toast) => setToast({ ...t, key: Date.now() }), [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), SHOW_MS)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext value={show}>
      {children}
      <div role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-20 flex justify-center px-4 lg:bottom-6">
        {toast && (
          <div className="pointer-events-auto flex items-center gap-4 rounded-card bg-secondary px-4 py-3 text-body text-white shadow-pop">
            <span>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                className="font-semibold text-income"
                onClick={() => {
                  toast.action!.onClick()
                  setToast(null)
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext>
  )
}
