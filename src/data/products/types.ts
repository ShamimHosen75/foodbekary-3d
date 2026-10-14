import type { CategorySlug } from '../categories'

export interface Product {
  id: string
  slug: string
  name: string
  category: CategorySlug
  /** Regular price in whole taka. */
  price: number
  /** Discounted price, when on offer. Always lower than `price`. */
  salePrice?: number
  /** Resolved image URLs, first is the cover. */
  images: string[]
  description: string
  ingredients: string[]
  /** Short feature pills ("100% fresh daily"). */
  features: string[]
  /** Card badge text ("Bestseller"). */
  badge?: string
  /** Filter-chip ids this product appears under (see collections.ts). */
  collections: string[]
  /** Extra search keywords. */
  tags: string[]
  /** Units available today; 0 = sold out. */
  stock: number
}

/** Shape authored in the per-category files; images are attached by slug. */
export type ProductSeed = Omit<Product, 'images' | 'id'>
