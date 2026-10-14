import type { CategorySlug } from '../categories'
import { cakes } from './cakes'
import { cookies } from './cookies'
import { macarons } from './macarons'
import { pastries } from './pastries'
import type { Product, ProductSeed } from './types'

export type { Product } from './types'

const imageUrls = import.meta.glob<string>('../../assets/products/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
})

/** Attach every `<slug>-<n>.webp` found for a product, in order. */
function imagesFor(slug: string): string[] {
  return Object.entries(imageUrls)
    .filter(([path]) => new RegExp(`/${slug}-\\d+-\\d+\\.webp$`).test(path))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url)
}

const seeds: ProductSeed[] = [...cakes, ...cookies, ...macarons, ...pastries]

export const products: Product[] = seeds.map((seed) => ({ ...seed, id: seed.slug, images: imagesFor(seed.slug) }))

const bySlug = new Map(products.map((p) => [p.slug, p]))

export const getProduct = (slug: string | undefined): Product | undefined => (slug ? bySlug.get(slug) : undefined)

export const productsIn = (category: CategorySlug): Product[] => products.filter((p) => p.category === category)
