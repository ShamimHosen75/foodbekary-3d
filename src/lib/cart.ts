import { getProduct, type Product } from '../data/products'
import type { CartLine } from '../store/cartStore'
import { maxOrderable } from '../hooks/useAddToCart'
import { unitPrice } from './pricing'

export interface CartItem {
  product: Product
  qty: number
  unit: number
  lineTotal: number
  /** Highest quantity allowed right now (stock and per-line cap). */
  max: number
  /** Set when the saved quantity could not be honoured. */
  issue?: 'sold-out' | 'reduced'
}

export interface ResolvedCart {
  items: CartItem[]
  /** Items that can actually be ordered (not sold out). */
  orderable: CartItem[]
  count: number
  subtotal: number
}

/**
 * Turns persisted cart lines into priced items against today's catalogue.
 * Unknown products are dropped; quantities above stock are reduced and flagged.
 */
export function resolveCart(lines: CartLine[]): ResolvedCart {
  const items: CartItem[] = []
  for (const line of lines) {
    const product = getProduct(line.productId)
    if (!product) continue
    const max = maxOrderable(product)
    const qty = Math.min(line.qty, Math.max(max, 0))
    const unit = unitPrice(product)
    const issue = max <= 0 ? 'sold-out' : qty < line.qty ? 'reduced' : undefined
    items.push({ product, qty: max <= 0 ? line.qty : qty, unit, lineTotal: max <= 0 ? 0 : unit * qty, max, issue })
  }
  const orderable = items.filter((i) => i.issue !== 'sold-out')
  return {
    items,
    orderable,
    count: orderable.reduce((n, i) => n + i.qty, 0),
    subtotal: orderable.reduce((n, i) => n + i.lineTotal, 0),
  }
}
