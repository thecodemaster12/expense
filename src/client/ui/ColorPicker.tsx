import { Check } from 'lucide-react'
import { colors, type Color } from '../../shared/schemas/common.ts'
import { paletteClasses } from './palette.ts'

/** Row of palette dots; arrow keys aren't wired, each dot is its own tab stop. */
export function ColorPicker({ value, onChange }: { value: Color; onChange: (color: Color) => void }) {
  return (
    <div role="radiogroup" aria-label="Color" className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={color === value}
          aria-label={color}
          onClick={() => onChange(color)}
          className={`grid size-8 place-items-center rounded-full text-white ${paletteClasses[color].dot} ${
            color === value ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
        >
          {color === value && <Check size={14} strokeWidth={3} aria-hidden />}
        </button>
      ))}
    </div>
  )
}
