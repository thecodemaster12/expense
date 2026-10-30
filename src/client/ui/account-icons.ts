import { Banknote, Briefcase, Coins, CreditCard, House, Landmark, PiggyBank, Smartphone, Vault, Wallet, type LucideIcon } from 'lucide-react'
import type { AccountIcon } from '../../shared/schemas/account.ts'

export const accountIconComponents: Record<AccountIcon, LucideIcon> = {
  bank: Landmark,
  wallet: Wallet,
  mobile: Smartphone,
  card: CreditCard,
  savings: PiggyBank,
  cash: Banknote,
  coins: Coins,
  work: Briefcase,
  home: House,
  safe: Vault,
}
