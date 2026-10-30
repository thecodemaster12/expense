import type { CategoryColor } from '../../shared/schemas/category.ts'
import { categoryColorClasses } from './category-colors.ts'

/** Pill in the category's stored color; no category means a transfer. */
export function CategoryBadge({ category }: { category: { name: string; color: CategoryColor } | undefined }) {
  const tone = category ? categoryColorClasses[category.color].badge : 'text-transfer bg-transfer-soft'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-body-sm font-medium ${tone}`}>
      {category?.name ?? 'Transfer'}
    </span>
  )
}
