import { Button } from './Button.tsx'
import { Modal } from './Modal.tsx'

type Props = {
  open: boolean
  title: string
  confirmLabel: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, confirmLabel, busy, onConfirm, onCancel }: Props) {
  return (
    <Modal open={open} onClose={onCancel} label={title}>
      <p className="text-title">{title}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" disabled={busy} onClick={onConfirm}>
          {busy ? 'Working…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
