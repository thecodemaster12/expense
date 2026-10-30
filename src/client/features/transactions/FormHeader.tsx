import { X } from 'lucide-react'

export function FormHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex max-w-md items-center justify-between">
      <h1 className="text-headline-sm lg:text-headline">{title}</h1>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-muted"
      >
        <X size={22} aria-hidden />
      </button>
    </div>
  )
}
