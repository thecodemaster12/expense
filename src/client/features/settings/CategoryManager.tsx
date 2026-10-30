import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { nextColor, type Category, type CategoryColor, type CategoryKind } from '../../../shared/schemas/category.ts'
import * as api from '../../lib/api.ts'
import { categoriesQuery, invalidateMoney } from '../../lib/queries.ts'
import { Button } from '../../ui/Button.tsx'
import { CategoryBadge } from '../../ui/CategoryBadge.tsx'
import { ColorPicker } from '../../ui/ColorPicker.tsx'
import { Input } from '../../ui/Input.tsx'
import { SegmentedControl } from '../../ui/SegmentedControl.tsx'
import { useToast } from '../../ui/toast-context.ts'
import { DeleteCategoryDialog } from './DeleteCategoryDialog.tsx'

const kinds: { value: CategoryKind; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
]

const iconButton = 'grid size-10 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-secondary'

const fieldError = (e: unknown) =>
  e instanceof api.ApiError && e.status === 400 ? (e.fields.name ?? 'Check the name') : "Couldn't save. Try again."

export function CategoryManager() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const categories = useQuery(categoriesQuery)
  const [kind, setKind] = useState<CategoryKind>('expense')
  const [editing, setEditing] = useState<{ id: number; name: string; color: CategoryColor; error?: string } | null>(null)
  const [newName, setNewName] = useState('')
  const [pickedColor, setPickedColor] = useState<CategoryColor | null>(null)
  const [addError, setAddError] = useState('')
  const [deleting, setDeleting] = useState<Category | null>(null)

  const list = (categories.data ?? [])
    .filter((c) => c.kind === kind && !c.archived)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
  // until the user picks one, a new category gets the next color this kind isn't using
  const newColor = pickedColor ?? nextColor(list.map((c) => c.color), kind)

  const create = useMutation({
    mutationFn: () => api.createCategory({ name: newName, kind, color: newColor }),
    onSuccess: (c) => {
      void invalidateMoney(queryClient)
      toast({ message: `Added ${c.name}` })
      setNewName('')
      setPickedColor(null)
    },
    onError: (e) => setAddError(fieldError(e)),
  })

  const rename = useMutation({
    mutationFn: ({ id, name, color }: { id: number; name: string; color: CategoryColor }) => api.updateCategory(id, { name, color }),
    onSuccess: () => {
      void invalidateMoney(queryClient)
      setEditing(null)
    },
    onError: (e) => setEditing((ed) => ed && { ...ed, error: fieldError(e) }),
  })

  function submitNew(e: FormEvent) {
    e.preventDefault()
    if (newName.trim()) create.mutate()
  }

  function submitRename(e: FormEvent) {
    e.preventDefault()
    if (editing?.name.trim()) rename.mutate(editing)
  }

  return (
    <section className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <div className="space-y-3 p-4">
        <h2 className="text-title">Categories</h2>
        <SegmentedControl label="Category kind" options={kinds} value={kind} onChange={(k) => {
            setKind(k)
            setEditing(null)
            setPickedColor(null)
          }} />
      </div>

      {categories.isPending ? (
        <p className="px-4 pb-4 text-muted">Loading…</p>
      ) : (
        <ul className="divide-y divide-border border-t border-border">
          {list.map((c) =>
            editing?.id === c.id ? (
              <li key={c.id} className="px-4 py-3">
                <form onSubmit={submitRename} className="flex items-center gap-2">
                  <Input
                    autoFocus
                    aria-label={`Rename ${c.name}`}
                    aria-invalid={!!editing.error}
                    maxLength={40}
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value, error: undefined })}
                    onKeyDown={(e) => e.key === 'Escape' && setEditing(null)}
                    className="h-10 min-w-0 flex-1"
                  />
                  <button type="submit" aria-label="Save name" className={iconButton} disabled={rename.isPending}>
                    <Check size={18} aria-hidden />
                  </button>
                  <button type="button" aria-label="Cancel rename" className={iconButton} onClick={() => setEditing(null)}>
                    <X size={18} aria-hidden />
                  </button>
                </form>
                {editing.error && <p className="mt-1 text-body-sm text-expense">{editing.error}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <CategoryBadge category={{ name: editing.name || c.name, color: editing.color }} />
                  <ColorPicker value={editing.color} onChange={(color) => setEditing({ ...editing, color })} />
                </div>
              </li>
            ) : (
              <li key={c.id} className="flex items-center gap-2 py-1 pr-2 pl-4">
                <CategoryBadge category={c} />
                <span className="flex-1 text-body-sm text-muted">{c.uses ? `${c.uses} in last 90 days` : ''}</span>
                <button type="button" aria-label={`Edit ${c.name}`} className={iconButton} onClick={() => setEditing({ id: c.id, name: c.name, color: c.color })}>
                  <Pencil size={16} aria-hidden />
                </button>
                <button type="button" aria-label={`Delete ${c.name}`} className={iconButton} onClick={() => setDeleting(c)}>
                  <Trash2 size={16} aria-hidden />
                </button>
              </li>
            ),
          )}
        </ul>
      )}

      <form onSubmit={submitNew} className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            aria-label={`New ${kind} category`}
            placeholder={`New ${kind} category`}
            maxLength={40}
            value={newName}
            aria-invalid={!!addError}
            onChange={(e) => {
              setNewName(e.target.value)
              setAddError('')
            }}
            className="min-w-0 flex-1"
          />
          <Button type="submit" disabled={!newName.trim() || create.isPending}>
            Add
          </Button>
        </div>
        {addError && <p className="mt-1 text-body-sm text-expense">{addError}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <CategoryBadge category={{ name: newName.trim() || 'Preview', color: newColor }} />
          <ColorPicker value={newColor} onChange={setPickedColor} />
        </div>
      </form>

      {deleting && categories.data && (
        <DeleteCategoryDialog
          key={deleting.id}
          category={deleting}
          categories={categories.data}
          onClose={() => setDeleting(null)}
        />
      )}
    </section>
  )
}
