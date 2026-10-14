import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { useAddToCart } from '../../hooks/useAddToCart'
import { cn } from '../../lib/cn'
import { isLowStock, isSoldOut } from '../../lib/pricing'
import { useUiStore } from '../../store/uiStore'
import { Badge, Button, Card, SmartImage } from '../ui'
import { FavoriteButton } from './FavoriteButton'
import { PriceTag } from './PriceTag'

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart()
  const openQuickView = useUiStore((s) => s.openQuickView)
  const soldOut = isSoldOut(product)

  return (
    <Card interactive as="article" className="h-full">
      <div className="relative aspect-[5/3] overflow-hidden bg-sand">
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          aria-label={`Quick view: ${product.name}`}
          className="group/qv absolute inset-0 block h-full w-full cursor-pointer"
        >
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            width={640}
            height={480}
            loading="lazy"
            decoding="async"
            wrapperClassName="h-full w-full"
            className={cn(
              'h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out-soft group-hover/card:scale-105',
              soldOut && 'grayscale-[60%]',
            )}
          />
          <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors duration-300 group-hover/qv:bg-ink/25 group-focus-visible/qv:bg-ink/25">
            <span className="translate-y-2 rounded-full bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink opacity-0 shadow-card transition-all duration-300 group-hover/qv:translate-y-0 group-hover/qv:opacity-100 group-focus-visible/qv:translate-y-0 group-focus-visible/qv:opacity-100">
              🔍 Quick View
            </span>
          </span>
        </button>
        <div className="pointer-events-none absolute top-3 right-3 left-3 flex items-start justify-end gap-2">
          {soldOut ? <Badge variant="neutral" className="bg-surface/90">Sold out</Badge> : product.badge && <Badge>{product.badge}</Badge>}
          <FavoriteButton productId={product.id} name={product.name} className="pointer-events-auto" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="text-lg leading-snug font-semibold">
          <Link to={`/product/${product.slug}`} className="transition-colors hover:text-accent-ink group-hover/card:text-accent-ink">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{product.description}</p>
        {isLowStock(product) && <p className="text-xs font-semibold text-accent-ink">Only {product.stock} left today</p>}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <PriceTag product={product} className="text-sm" />
          <Button size="sm" variant="accent" disabled={soldOut} onClick={() => addToCart(product)} aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}>
            {soldOut ? 'Sold out' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
