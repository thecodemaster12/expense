// Money is always integer taka (docs/decisions/0004-integer-taka.md).
const lakh = new Intl.NumberFormat('en-IN')

/** 115000 → "৳1,15,000", -3420 → "−৳3,420" */
export function formatTaka(amount: number): string {
  const text = `৳${lakh.format(Math.abs(amount))}`
  return amount < 0 ? `−${text}` : text
}

/** "৳1,15,000" → 115000. Returns null for anything that isn't whole taka. */
export function parseTaka(input: string): number | null {
  const clean = input.replace(/[৳,\s]/g, '')
  if (!/^\d+$/.test(clean)) return null
  const amount = Number(clean)
  return Number.isSafeInteger(amount) ? amount : null
}

/** Like parseTaka but allows a leading minus (an opening balance can be money owed). */
export function parseSignedTaka(input: string): number | null {
  const negative = /^\s*[-−]/.test(input)
  const amount = parseTaka(input.replace(/^\s*[-−]/, ''))
  return amount && negative ? -amount : amount // amount && … keeps "-0" as 0
}
