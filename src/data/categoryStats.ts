import { unitPrice } from '../lib/pricing'
import type { CategorySlug } from './categories'
import { productsIn } from './products'

export interface CategoryStats {
  count: number
  fromPrice: number
}

export function getCategoryStats(slug: CategorySlug): CategoryStats {
  const list = productsIn(slug)
  return { count: list.length, fromPrice: Math.min(...list.map(unitPrice)) }
}
