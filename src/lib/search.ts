import type { Product } from '../data/products'

const norm = (s: string) => s.toLocaleLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').trim()
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Every whitespace-separated term must match the *start* of a word in the
 * product's text — so "red" finds "red velvet" but not "layered".
 */
export function matchesQuery(p: Product, query: string): boolean {
  const terms = norm(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const hay = norm([p.name, p.description, ...p.ingredients, ...p.tags, p.badge ?? ''].join(' '))
  return terms.every((t) => new RegExp(`(^|[^\\p{L}\\p{N}])${escape(t)}`, 'u').test(hay))
}

export function filterProducts(list: Product[], collection: string | null, query: string): Product[] {
  return list.filter((p) => (!collection || p.collections.includes(collection)) && matchesQuery(p, query))
}
