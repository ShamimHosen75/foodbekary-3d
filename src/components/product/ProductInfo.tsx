import type { Product } from '../../data/products'
import { Tag } from '../ui'

/** Ingredient + feature pills (Quick View and product page). */
export function ProductInfo({ product, headingLevel = 'h3' }: { product: Product; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Heading className="font-sans text-sm font-semibold text-ink">Key ingredients</Heading>
        <ul className="flex flex-wrap gap-2">
          {product.ingredients.map((i) => (
            <li key={i}><Tag>✨ {i}</Tag></li>
          ))}
        </ul>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Features">
        {product.features.map((f) => (
          <li key={f} className="rounded-full bg-ink/[0.06] px-3 py-1.5 text-xs font-medium text-ink">{f}</li>
        ))}
      </ul>
    </div>
  )
}
