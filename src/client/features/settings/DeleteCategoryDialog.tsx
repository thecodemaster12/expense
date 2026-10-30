import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { Category } from '../../../shared/schemas/category.ts'
import * as api from '../../lib/api.ts'
import { invalidateMoney } from '../../lib/queries.ts'
import { Button } from '../../ui/Button.tsx'
import { Select } from '../../ui/Input.tsx'
import { Modal } from '../../ui/Modal.tsx'
import { useToast } from '../../ui/toast-context.ts'

type Props = { category: Category; categories: Category[]; onClose: () => void }

/**
 * Shows how many entries use the category. If any do, they move (merge) into another
 * existing category of the same kind first. A plain rename is the Rename button's job.
 */
export function DeleteCategoryDialog({ category, categories, onClose }: Props) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const targets = categories.filter((c) => c.kind === category.kind && c.id !== category.id && !c.archived)
  const fallback = targets.find((c) => c.name === (category.kind === 'expense' ? 'Other' : 'Other Income')) ?? targets[0]
  const [moveTo, setMoveTo] = useState(fallback?.id)
  const [error, setError] = useState('')

  const remove = useMutation({
    mutationFn: (count: number) => api.deleteCategory(category.id, count ? moveTo : undefined),
    onSuccess: (_, count) => {
      void invalidateMoney(queryClient)
      const target = targets.find((c) => c.id === moveTo)?.name
      toast({ message: count ? `Deleted ${category.name} · ${count} entries moved to ${target}` : `Deleted ${category.name}` })
      onClose()
    },
    onError: (e) => {
      if (e instanceof api.ApiError && e.status === 400) setError(Object.values(e.fields)[0] ?? 'Check the form')
      else toast({ message: "Couldn't delete. Try again." })
    },
  })

  const usage = useQuery({
    queryKey: ['categories', 'usage', category.id],
    queryFn: () => api.getCategoryUsage(category.id),
    enabled: !remove.isSuccess, // don't refetch a category that's gone
  })
  const count = usage.data?.count

  return (
    <Modal open onClose={onClose} label={`Delete ${category.name}`}>
      <p className="text-title">Delete {category.name}?</p>

      {targets.length === 0 ? (
        <p className="mt-2 text-body text-muted">It's your only {category.kind} category, so it can't be deleted. Rename it instead.</p>
      ) : count === undefined ? (
        <p className="mt-2 text-body text-muted">{usage.isError ? "Couldn't check usage. Try again." : 'Checking entries…'}</p>
      ) : count === 0 ? (
        <p className="mt-2 text-body text-muted">No entries use it.</p>
      ) : (
        <div className="mt-2 space-y-3">
          <p className="text-body text-secondary">
            Used by <span className="font-semibold">{count}</span> {count === 1 ? 'entry' : 'entries'}. Move them to:
          </p>
          <Select aria-label="Move entries to" className="h-10 w-full" value={moveTo} onChange={(e) => setMoveTo(Number(e.target.value))}>
            {targets.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {error && <p className="mt-2 text-body-sm text-expense">{error}</p>}

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={targets.length === 0 || count === undefined || remove.isPending}
          onClick={() => count !== undefined && remove.mutate(count)}
        >
          {remove.isPending ? 'Working…' : count && targets.length ? 'Move & delete' : 'Delete'}
        </Button>
      </div>
    </Modal>
  )
}
