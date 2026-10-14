import { Link } from 'react-router-dom'
import { categoryPath } from '../../data/categories'
import { selectCartCount, useCartStore } from '../../store/cartStore'
import { useUiStore } from '../../store/uiStore'
import { buttonClasses } from '../ui'

/**
 * Phase 2 shell: empty state + item count. Line items, quantities and the
 * subtotal arrive in Phase 5 once products exist.
 */
export function CartPanel() {
  const count = useCartStore(selectCartCount)
  const close = useUiStore((s) => s.close)

  if (count === 0) {
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
  return <p className="text-sm text-muted">{count} item(s) in your basket.</p>
}
