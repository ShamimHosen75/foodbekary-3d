import { useId } from 'react'
import { Link } from 'react-router-dom'
import { getCategory } from '../../data/categories'
import { products } from '../../data/products'
import { isSoldOut } from '../../lib/pricing'
import { useUiStore } from '../../store/uiStore'
import { Badge, Modal } from '../ui'
import { FavoriteButton } from './FavoriteButton'
import { PriceTag } from './PriceTag'
import { ProductGallery } from './ProductGallery'
import { ProductInfo } from './ProductInfo'
import { PurchaseBox } from './PurchaseBox'

export function QuickViewModal() {
  const id = useUiStore((s) => s.quickView)
  const close = useUiStore((s) => s.closeQuickView)
  const titleId = useId()
  const product = products.find((p) => p.id === id)

  return (
    <Modal open={!!product} onClose={close} labelledBy={titleId} contentKey={id}>
      {product && (
        <div className="grid gap-6 p-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:p-6">
          <div className="relative">
            <ProductGallery key={product.id} images={product.images} name={product.name} />
            {/* Left-aligned so the modal's close button (top-right) never covers the heart. */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <FavoriteButton productId={product.id} name={product.name} />
              {isSoldOut(product) ? <Badge variant="neutral" className="bg-surface/90">Sold out</Badge> : product.badge && <Badge variant="accent">{product.badge}</Badge>}
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:pr-8">
            <p className="text-eyebrow font-semibold text-accent-ink uppercase">{getCategory(product.category)?.label}</p>
            <h2 id={titleId} className="-mt-2 text-[1.75rem] leading-tight font-semibold">{product.name}</h2>
            <PriceTag product={product} className="text-xl" />
            <p className="text-[0.9375rem] leading-relaxed text-muted">{product.description}</p>
            <ProductInfo product={product} />
            {/* On phones the purchase row sticks to the bottom of the sheet so it is always reachable. */}
            <div className="mt-auto space-y-3 pt-2 max-sm:sticky max-sm:bottom-0 max-sm:-mx-4 max-sm:border-t max-sm:border-line max-sm:bg-sand max-sm:px-4 max-sm:pb-4">
              <PurchaseBox key={product.id} product={product} onAdded={close} />
              <Link to={`/product/${product.slug}`} onClick={close} className="inline-block text-sm font-semibold text-ink underline-offset-4 hover:underline">
                View full details →
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
