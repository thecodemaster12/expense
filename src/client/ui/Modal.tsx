import { useEffect, useRef, type ReactNode } from 'react'

type Props = { open: boolean; onClose: () => void; label: string; children: ReactNode }

/** Native <dialog>: focus trap, Esc to close and backdrop come for free. */
export function Modal({ open, onClose, label, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog?.open) dialog?.showModal()
    if (!open && dialog?.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // click on the backdrop (the dialog element itself, outside its content) closes it
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[min(22rem,calc(100%-2rem))] rounded-sheet bg-surface p-0 text-ink shadow-sheet backdrop:bg-primary/30 backdrop:backdrop-blur-xs"
    >
      <div className="p-6">{children}</div>
    </dialog>
  )
}
