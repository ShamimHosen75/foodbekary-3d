import type { CategorySlug } from './categories'

export interface CategoryStats {
  count: number
  fromPrice: number
}

/**
 * PLACEHOLDER until the product catalogue lands in Phase 4, when this will be
 * derived from src/data/products.ts instead of hard-coded.
 */
const stats: Record<CategorySlug, CategoryStats> = {
  cakes: { count: 8, fromPrice: 1800 },
  cookies: { count: 6, fromPrice: 120 },
  macarons: { count: 6, fromPrice: 90 },
  pastries: { count: 6, fromPrice: 180 },
}

export const getCategoryStats = (slug: CategorySlug): CategoryStats => stats[slug]
