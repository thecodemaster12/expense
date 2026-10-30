import type { Category } from '../../shared/schemas/category.ts'

// Seed categories get their design colors; anything added later uses the neutral tone.
const tones: Record<string, string> = {
  Rent: 'text-cat-rent bg-cat-rent-bg',
  Food: 'text-cat-food bg-cat-food-bg',
  'Electricity & Bills': 'text-cat-bills bg-cat-bills-bg',
  Travel: 'text-cat-travel bg-cat-travel-bg',
  Shopping: 'text-cat-shopping bg-cat-shopping-bg',
  Health: 'text-cat-health bg-cat-health-bg',
  Family: 'text-cat-family bg-cat-family-bg',
}

function tone(category: Category | undefined) {
  if (!category) return 'text-transfer bg-transfer-soft'
  if (category.kind === 'income') return 'text-primary bg-income-soft'
  return tones[category.name] ?? 'text-cat-other bg-cat-other-bg'
}

/** Pill with the category's color; no category means a transfer. */
export function CategoryBadge({ category }: { category: Category | undefined }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-body-sm font-medium ${tone(category)}`}>
      {category?.name ?? 'Transfer'}
    </span>
  )
}
