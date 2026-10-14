import { Link } from 'react-router-dom'
import type { CartItem } from '../../lib/cart'
import { formatPrice } from '../../lib/format'
import { MAX_QTY_PER_LINE, useCartStore } from '../../store/cartStore'
import { QuantityStepper } from '../ui'

export function CartLineItem({ item }: { item: CartItem }) {
  const setQty = useCartStore((s) => s.setQty)
  const remove = useCartStore((s) => s.remove)
  const { product, qty, unit, lineTotal, max, issue } = item
  const soldOut = issue === 'sold-out'

  return (
    <li className="flex gap-3 border-b border-dashed border-line py-4 first:pt-0" data-testid="cart-line">
      <img src={product.images[0]} alt="" width={64} height={48} className={`h-14 w-16 shrink-0 rounded-lg object-cover ${soldOut ? 'grayscale' : ''}`} />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${product.slug}`} className="font-display leading-snug font-semibold text-ink hover:text-accent-ink">
            {product.name}
          </Link>
          <button
            type="button"
            onClick={() => remove(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-sm text-danger hover:bg-danger/10"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <p className="text-xs text-muted">{formatPrice(unit)} each</p>
        {soldOut ? (
          <p className="text-xs font-semibold text-danger">Sold out today — remove to continue.</p>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <QuantityStepper size="sm" value={qty} max={max} label={product.name} onChange={(n) => setQty(product.id, n)} />
            <span className="text-sm font-bold tabular-nums">{formatPrice(lineTotal)}</span>
          </div>
        )}
        {issue === 'reduced' && (
          <p className="text-xs font-semibold text-accent-ink">
            {product.stock > MAX_QTY_PER_LINE
              ? `Maximum ${MAX_QTY_PER_LINE} per order — for more, message us on WhatsApp.`
              : `Only ${max} left today — we’ve adjusted your quantity.`}
          </p>
        )}
      </div>
    </li>
  )
}
