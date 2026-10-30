import { formatTaka } from '../../shared/money.ts'
import type { TransactionType } from '../../shared/schemas/transaction.ts'

const styles: Record<TransactionType, { sign: string; color: string }> = {
  income: { sign: '+', color: 'text-income' },
  expense: { sign: '−', color: 'text-expense' },
  transfer: { sign: '⇄ ', color: 'text-transfer' },
}

/** Amount in mono; with a `type`, signed and colored (+ income, − expense, ⇄ transfer). */
export function Money({ amount, type, className = '' }: { amount: number; type?: TransactionType; className?: string }) {
  const style = type ? styles[type] : { sign: '', color: '' }
  return (
    <span className={`font-mono whitespace-nowrap ${style.color} ${className}`}>
      {style.sign}
      {formatTaka(amount)}
    </span>
  )
}
