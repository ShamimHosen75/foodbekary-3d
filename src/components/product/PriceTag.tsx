import type { Product } from '../../data/products'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import { isOnSale, unitPrice } from '../../lib/pricing'

export function PriceTag({ product, className }: { product: Product; className?: string }) {
  const sale = isOnSale(product)
  return (
    <p className={cn('flex items-baseline gap-2 font-bold whitespace-nowrap', className)}>
      <span className={sale ? 'text-accent-ink' : undefined}>
        {sale && <span className="sr-only">Sale price </span>}
        {formatPrice(unitPrice(product))}
      </span>
      {sale && (
        <s className="text-[0.8em] font-medium text-muted">
          <span className="sr-only">was </span>
          {formatPrice(product.price)}
        </s>
      )}
    </p>
  )
}
