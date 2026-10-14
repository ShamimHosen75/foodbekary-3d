import { motion, useReducedMotion } from 'framer-motion'
import { resolveCart } from '../../lib/cart'
import { useCartStore } from '../../store/cartStore'
import { useUiStore } from '../../store/uiStore'

export function CartButton() {
  // Count what the drawer will actually show (unknown products are dropped there too).
  const lines = useCartStore((s) => s.lines)
  const count = resolveCart(lines).items.reduce((n, i) => n + i.qty, 0)
  const open = useUiStore((s) => s.open)
  const reduce = useReducedMotion()
  return (
    <button
      type="button"
      onClick={() => open('cart')}
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-ink pr-1.5 pl-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-strong"
    >
      <span aria-hidden="true">🛒</span>
      <span className="hidden sm:inline">Cart</span>
      {/* Keyed by count so the badge "bumps" whenever the cart changes. */}
      <motion.span
        key={count}
        initial={reduce ? false : { scale: 1.45 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
        aria-hidden="true"
        data-testid="cart-count"
        className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[0.6875rem] font-bold text-ink tabular-nums"
      >
        {count}
      </motion.span>
    </button>
  )
}
