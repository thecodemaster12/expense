import { accountIcons, type AccountIcon } from '../../../shared/schemas/account.ts'
import { accountIconComponents } from '../../ui/account-icons.ts'

export function IconPicker({ value, onChange }: { value: AccountIcon; onChange: (icon: AccountIcon) => void }) {
  return (
    <div role="radiogroup" aria-label="Icon" className="flex flex-wrap gap-2">
      {accountIcons.map((icon) => {
        const Icon = accountIconComponents[icon]
        const selected = icon === value
        return (
          <button
            key={icon}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={icon}
            onClick={() => onChange(icon)}
            className={`grid size-10 place-items-center rounded-input border ${
              selected ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-secondary hover:bg-surface-muted'
            }`}
          >
            <Icon size={18} aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
