import { useState } from 'react'
import type { Product } from '../../data/products'
import { maxOrderable, useAddToCart } from '../../hooks/useAddToCart'
import { formatPrice } from '../../lib/format'
import { isLowStock, isSoldOut, unitPrice } from '../../lib/pricing'
import { selectQtyInCart, useCartStore } from '../../store/cartStore'
import { Button, QuantityStepper } from '../ui'

/** Quantity + "Add N to Cart • ৳ total" button, shared by Quick View and the product page. */
export function PurchaseBox({ product, onAdded }: { product: Product; onAdded?: () => void }) {
  const addToCart = useAddToCart()
  const inCart = useCartStore(selectQtyInCart(product.id))
  const room = Math.max(0, maxOrderable(product) - inCart)
  const [qty, setQty] = useState(1)
  const safeQty = Math.min(qty, Math.max(room, 1))

  if (isSoldOut(product)) {
    return <p className="rounded-xl bg-ink/[0.06] px-4 py-3 text-sm font-semibold">Sold out for today — fresh batch tomorrow morning.</p>
  }
  if (room === 0) {
    return <p className="rounded-xl bg-accent-tint px-4 py-3 text-sm font-semibold text-accent-ink">You have all {inCart} of today’s stock in your cart.</p>
  }
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={safeQty} onChange={setQty} max={room} label={product.name} />
        <Button
          size="lg"
          className="flex-1"
          onClick={() => {
            addToCart(product, safeQty, { openCart: true })
            setQty(1)
            onAdded?.()
          }}
        >
          <span aria-hidden="true">🛒</span> Add {safeQty} to Cart • {formatPrice(unitPrice(product) * safeQty)}
        </Button>
      </div>
      {(isLowStock(product) || inCart > 0) && (
        <p className="text-xs text-muted">
          {isLowStock(product) && <span className="font-semibold text-accent-ink">Only {product.stock} left today. </span>}
          {inCart > 0 && <>{inCart} already in your cart.</>}
        </p>
      )}
    </div>
  )
}
