import { Link } from 'react-router-dom'
import { categoryPath } from '../../data/categories'
import { resolveCart } from '../../lib/cart'
import { formatPrice } from '../../lib/format'
import { useCartStore } from '../../store/cartStore'
import { useUiStore } from '../../store/uiStore'
import { CartLineItem } from '../cart/CartLineItem'
import { buttonClasses } from '../ui'

export function CartPanel() {
  const lines = useCartStore((s) => s.lines)
  const close = useUiStore((s) => s.close)
  const cart = resolveCart(lines)
  const blocked = cart.items.some((i) => i.issue === 'sold-out')

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <span aria-hidden="true" className="text-5xl">🧺</span>
        <p className="font-display text-lg font-semibold">Your basket is empty</p>
        <p className="text-sm text-muted">Pick something fresh from the counter.</p>
        <Link to={categoryPath('cakes')} onClick={close} className={buttonClasses('accent', 'md')}>
          Browse the menu
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      <ul aria-label="Items in your order" className="flex-1">
        {cart.items.map((item) => (
          <CartLineItem key={item.product.id} item={item} />
        ))}
      </ul>
      {/* Sticks to the bottom of the drawer's scroll area so the total and CTA stay visible. */}
      <div className="sticky -bottom-4 -mx-5 mt-4 space-y-3 border-t border-line bg-surface px-5 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-base font-semibold">Subtotal</span>
          <span className="text-lg font-bold tabular-nums" data-testid="drawer-subtotal">{formatPrice(cart.subtotal)}</span>
        </div>
        <p className="text-xs text-muted">Delivery is calculated at checkout. Pay cash when your order arrives.</p>
        {blocked ? (
          <p role="alert" className="rounded-xl bg-danger/10 px-3 py-2 text-xs font-semibold text-danger">
            Remove sold-out items to continue.
          </p>
        ) : (
          <Link to="/checkout" onClick={close} className={buttonClasses('accent', 'lg', 'w-full')}>
            Checkout · {formatPrice(cart.subtotal)}
          </Link>
        )}
        <button type="button" onClick={close} className="w-full cursor-pointer text-center text-sm font-semibold text-muted hover:text-ink">
          Continue shopping
        </button>
      </div>
    </div>
  )
}
