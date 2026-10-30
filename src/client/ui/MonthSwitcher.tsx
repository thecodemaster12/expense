import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { addMonths, MONTHS, monthLabel, monthOf, todayDhaka } from '../../shared/date.ts'
import { Modal } from './Modal.tsx'

const iconButton = 'grid size-10 place-items-center rounded-full text-secondary hover:bg-surface-muted'

/** ‹ Oct 2026 › — arrows step one month; tapping the label opens a picker to jump anywhere in one go. */
export function MonthSwitcher({ month, onChange }: { month: string; onChange: (month: string) => void }) {
  const [picking, setPicking] = useState(false)
  const [year, setYear] = useState(Number(month.slice(0, 4)))
  const current = monthOf(todayDhaka())

  function open() {
    setYear(Number(month.slice(0, 4)))
    setPicking(true)
  }

  return (
    <div className="flex items-center gap-1">
      <button type="button" aria-label="Previous month" className={iconButton} onClick={() => onChange(addMonths(month, -1))}>
        <ChevronLeft size={20} aria-hidden />
      </button>
      <button
        type="button"
        onClick={open}
        aria-label={`${monthLabel(month)}, pick a month`}
        className="inline-flex h-10 min-w-28 items-center justify-center gap-1 rounded-input px-2 text-title hover:bg-surface-muted"
      >
        {monthLabel(month)}
        <ChevronDown size={16} className="text-muted" aria-hidden />
      </button>
      <button type="button" aria-label="Next month" className={iconButton} onClick={() => onChange(addMonths(month, 1))}>
        <ChevronRight size={20} aria-hidden />
      </button>

      <Modal open={picking} onClose={() => setPicking(false)} label="Pick a month">
        <div className="flex items-center justify-between">
          <button type="button" aria-label="Previous year" className={iconButton} onClick={() => setYear((y) => y - 1)}>
            <ChevronLeft size={20} aria-hidden />
          </button>
          <p className="font-mono text-money-lg">{year}</p>
          <button type="button" aria-label="Next year" className={iconButton} onClick={() => setYear((y) => y + 1)}>
            <ChevronRight size={20} aria-hidden />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {MONTHS.map((name, i) => {
            const value = `${year}-${String(i + 1).padStart(2, '0')}`
            const selected = value === month
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  onChange(value)
                  setPicking(false)
                }}
                className={`h-11 rounded-input text-label ${
                  selected
                    ? 'bg-primary font-semibold text-white'
                    : `hover:bg-surface-muted ${value === current ? 'border border-primary text-primary' : 'text-secondary'}`
                }`}
              >
                {name}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          className="mt-4 w-full text-label font-semibold text-primary"
          onClick={() => {
            onChange(current)
            setPicking(false)
          }}
        >
          This month
        </button>
      </Modal>
    </div>
  )
}
