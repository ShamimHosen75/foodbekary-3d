import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { PriceTag } from '../product/PriceTag'

/** Compact product line used by the search and favourites panels. */
export function ProductRow({ product, meta, action }: { product: Product; meta?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-cream">
      <img src={product.images[0]} alt="" width={56} height={42} loading="lazy" className="h-12 w-14 shrink-0 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <Link to={`/product/${product.slug}`} className="block truncate font-display font-semibold text-ink after:absolute after:inset-0 after:content-['']">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted">
          <PriceTag product={product} className="text-xs text-ink" />
          {meta && <span>· {meta}</span>}
        </div>
      </div>
      {action}
    </div>
  )
}
