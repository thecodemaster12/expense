import { Check } from 'lucide-react'
import { categoryColors, type CategoryColor } from '../../shared/schemas/category.ts'
import { categoryColorClasses } from './category-colors.ts'

/** Row of palette dots; arrow keys aren't wired, each dot is its own tab stop. */
export function ColorPicker({ value, onChange }: { value: CategoryColor; onChange: (color: CategoryColor) => void }) {
  return (
    <div role="radiogroup" aria-label="Color" className="flex flex-wrap gap-2">
      {categoryColors.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={color === value}
          aria-label={color}
          onClick={() => onChange(color)}
          className={`grid size-8 place-items-center rounded-full text-white ${categoryColorClasses[color].dot} ${
            color === value ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
        >
          {color === value && <Check size={14} strokeWidth={3} aria-hidden />}
        </button>
      ))}
    </div>
  )
}
