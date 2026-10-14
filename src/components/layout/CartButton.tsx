import { selectCartCount, useCartStore } from '../../store/cartStore'
import { useUiStore } from '../../store/uiStore'

export function CartButton() {
  const count = useCartStore(selectCartCount)
  const open = useUiStore((s) => s.open)
  return (
    <button
      type="button"
      onClick={() => open('cart')}
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-ink pr-1.5 pl-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-strong"
    >
      <span aria-hidden="true">🛒</span>
      <span className="hidden sm:inline">Cart</span>
      <span
        aria-hidden="true"
        data-testid="cart-count"
        className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[0.6875rem] font-bold text-ink tabular-nums"
      >
        {count}
      </span>
    </button>
  )
}
