import { products } from '../../data/products'
import { useAddToCart } from '../../hooks/useAddToCart'
import { isSoldOut } from '../../lib/pricing'
import { useFavoritesStore } from '../../store/favoritesStore'
import { Button } from '../ui'
import { ComingSoonPanel } from './ComingSoonPanel'
import { ProductRow } from './ProductRow'

export function FavoritesPanel() {
  const ids = useFavoritesStore((s) => s.ids)
  const remove = useFavoritesStore((s) => s.remove)
  const addToCart = useAddToCart()
  const saved = ids.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined)

  if (saved.length === 0) return <ComingSoonPanel icon="🤍" text="Tap the heart on anything you love and it will wait for you here." />

  return (
    <ul className="space-y-1">
      {saved.map((p) => (
        <li key={p.id} className="relative">
          <ProductRow
            product={p}
            action={
              <div className="relative z-10 flex items-center gap-1">
                <Button size="sm" variant="accent" disabled={isSoldOut(p)} onClick={() => addToCart(p)} aria-label={`Add ${p.name} to cart`}>
                  {isSoldOut(p) ? 'Sold out' : 'Add'}
                </Button>
                <button type="button" onClick={() => remove(p.id)} aria-label={`Remove ${p.name} from favourites`} className="grid size-8 cursor-pointer place-items-center rounded-full text-sm text-danger hover:bg-surface">
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
            }
          />
        </li>
      ))}
    </ul>
  )
}
