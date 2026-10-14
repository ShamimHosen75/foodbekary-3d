import { m, useReducedMotion } from 'framer-motion'
import type { Product } from '../../data/products'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { hydration } from '../../lib/hydration'
import { ProductCard } from './ProductCard'

export interface ProductGridProps {
  products: Product[]
  /** Changing this replays the staggered entrance (e.g. on filter change). */
  animationKey: string
}

/**
 * Three columns normally; when only one or two items match, the grid uses two
 * wider columns instead of leaving a gap (REFERENCE_ANALYSIS.md §4).
 */
export function ProductGrid({ products, animationKey }: ProductGridProps) {
  const reduce = useReducedMotion()
  const few = products.length <= 2
  // Prerendered grid is already on screen: skip the entrance for that first key only.
  const [hydratedKey] = useState(() => (hydration.active ? animationKey : null))
  return (
    <m.ul
      key={animationKey}
      initial={animationKey === hydratedKey ? false : 'hidden'}
      animate="shown"
      variants={{ shown: { transition: { staggerChildren: 0.07 } } }}
      className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2', !few && 'lg:grid-cols-3')}
      data-testid="product-grid"
    >
      {products.map((p, i) => (
        <m.li
          key={p.id}
          layout={!reduce}
          variants={
            reduce
              ? { hidden: { opacity: 0 }, shown: { opacity: 1 } }
              : { hidden: { opacity: 0, y: 22 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }
          }
        >
          <ProductCard product={p} priority={i === 0 ? 2 : i < 3 ? 1 : 0} />
        </m.li>
      ))}
    </m.ul>
  )
}
