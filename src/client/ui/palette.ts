import type { Color } from '../../shared/schemas/common.ts'

// Full class strings so Tailwind can find them; tokens live in index.css (--color-cat-*).
/** badge = text on tint (category pills); dot = solid (pickers, account bars, chart slices via `fill`). */
export const paletteClasses: Record<Color, { badge: string; dot: string }> = {
  indigo: { badge: 'text-cat-indigo bg-cat-indigo-bg', dot: 'bg-cat-indigo' },
  amber: { badge: 'text-cat-amber bg-cat-amber-bg', dot: 'bg-cat-amber' },
  slate: { badge: 'text-cat-slate bg-cat-slate-bg', dot: 'bg-cat-slate' },
  sky: { badge: 'text-cat-sky bg-cat-sky-bg', dot: 'bg-cat-sky' },
  rose: { badge: 'text-cat-rose bg-cat-rose-bg', dot: 'bg-cat-rose' },
  teal: { badge: 'text-cat-teal bg-cat-teal-bg', dot: 'bg-cat-teal' },
  purple: { badge: 'text-cat-purple bg-cat-purple-bg', dot: 'bg-cat-purple' },
  gray: { badge: 'text-cat-gray bg-cat-gray-bg', dot: 'bg-cat-gray' },
  green: { badge: 'text-cat-green bg-cat-green-bg', dot: 'bg-cat-green' },
  orange: { badge: 'text-cat-orange bg-cat-orange-bg', dot: 'bg-cat-orange' },
}

/** CSS color for SVG fills (charts): the solid palette token. */
export const paletteVar = (color: Color) => `var(--color-cat-${color})`
