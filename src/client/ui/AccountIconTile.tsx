import type { AccountIcon } from '../../shared/schemas/account.ts'
import type { Color } from '../../shared/schemas/common.ts'
import { accountIconComponents } from './account-icons.ts'
import { paletteClasses } from './palette.ts'

/** Soft tile: the color's tint as background, the icon in the color itself. */
export function AccountIconTile({ icon, color, small }: { icon: AccountIcon; color: Color; small?: boolean }) {
  const Icon = accountIconComponents[icon]
  return (
    <span className={`grid shrink-0 place-items-center rounded-input ${small ? 'size-8' : 'size-10'} ${paletteClasses[color].badge}`} aria-hidden>
      <Icon size={small ? 16 : 20} />
    </span>
  )
}
