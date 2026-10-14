const bdt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** Format a whole-taka amount as "৳ 2,400". */
export function formatPrice(amount: number): string {
  return `৳ ${bdt.format(Math.round(amount))}`
}
