import type { Category } from '../../../shared/schemas/category.ts'
import type { Transaction } from '../../../shared/schemas/transaction.ts'
import { CategoryBadge } from '../../ui/CategoryBadge.tsx'
import { Money } from '../../ui/Money.tsx'
import { useLongPress } from './useLongPress.ts'

type Props = {
  t: Transaction
  category: Category | undefined
  accountName: (id: number | null) => string
  onOpen: () => void
  onLongPress: () => void
}

export function TransactionRow({ t, category, accountName, onOpen, onLongPress }: Props) {
  const { handlers, wasLongPress } = useLongPress(onLongPress)
  const where = t.type === 'transfer' ? `${accountName(t.accountId)} → ${accountName(t.toAccountId)}` : accountName(t.accountId)

  return (
    <li>
      <button
        type="button"
        {...handlers}
        onClick={() => !wasLongPress() && onOpen()}
        className="flex w-full items-center gap-3 px-4 py-3 text-left select-none hover:bg-surface-muted [-webkit-touch-callout:none]"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body font-medium">{t.note || category?.name || 'Transfer'}</span>
          <span className="mt-1 flex items-center gap-2 text-body-sm text-muted">
            <CategoryBadge category={category} />
            <span className="truncate">{where}</span>
          </span>
        </span>
        <Money amount={t.amount} type={t.type} className="text-money" />
      </button>
    </li>
  )
}
