import { categories } from '../data/categories'
import { getCategoryStats } from '../data/categoryStats'
import { collections } from '../data/collections'
import { getProduct, products, productsIn } from '../data/products'
import { isOnSale, isSoldOut, unitPrice } from './pricing'
import { filterProducts, matchesQuery } from './search'

describe('catalogue data', () => {
  it('has 26 products with unique slugs and two images each', () => {
    expect(products).toHaveLength(26)
    expect(new Set(products.map((p) => p.slug)).size).toBe(26)
    for (const p of products) expect(p.images, p.slug).toHaveLength(2)
  })

  it('only uses collection ids defined for the product’s category', () => {
    for (const p of products) {
      const ids = collections[p.category].map((c) => c.id)
      for (const c of p.collections) expect(ids, `${p.slug} → ${c}`).toContain(c)
    }
  })

  it('sale prices are always below the regular price', () => {
    for (const p of products) if (p.salePrice !== undefined) expect(p.salePrice).toBeLessThan(p.price)
  })

  it('derives category stats from the products', () => {
    expect(getCategoryStats('cakes')).toEqual({ count: 8, fromPrice: 1800 })
    expect(getCategoryStats('pastries').fromPrice).toBe(180)
    for (const c of categories) expect(getCategoryStats(c.slug).count).toBe(productsIn(c.slug).length)
  })
})

describe('pricing', () => {
  it('uses the sale price when lower', () => {
    const p = getProduct('dark-truffle-drip-cake')!
    expect(unitPrice(p)).toBe(2300)
    expect(isOnSale(p)).toBe(true)
  })
  it('flags sold-out stock', () => expect(isSoldOut(getProduct('mango-cream-cake')!)).toBe(true))
})

describe('search + filter', () => {
  const cakes = productsIn('cakes')
  it('matches name, ingredients and tags, case/accent-insensitively', () => {
    expect(matchesQuery(getProduct('lotus-biscoff-cake')!, 'BISCOFF')).toBe(true)
    expect(matchesQuery(getProduct('mango-cream-cake')!, 'rajshahi')).toBe(true)
    expect(matchesQuery(getProduct('mango-cream-cake')!, 'chocolate')).toBe(false)
  })
  it('combines collection and query (AND)', () => {
    expect(filterProducts(cakes, 'chocolate', '').map((p) => p.slug)).toEqual(['chocolate-celebration-cake', 'dark-truffle-drip-cake'])
    expect(filterProducts(cakes, 'chocolate', 'truffle').map((p) => p.slug)).toEqual(['dark-truffle-drip-cake'])
    expect(filterProducts(cakes, 'fruit', 'truffle')).toEqual([])
  })
  it('matches word starts only ("red" ≠ "layered") and survives regex characters', () => {
    expect(matchesQuery(getProduct('dark-truffle-drip-cake')!, 'red')).toBe(false)
    expect(matchesQuery(getProduct('dark-truffle-drip-cake')!, 'truf')).toBe(true)
    expect(filterProducts(cakes, null, '(([')).toEqual([])
  })
  it('requires every term to match', () => {
    expect(filterProducts(cakes, null, 'red cream').map((p) => p.slug)).toEqual(['red-velvet-celebration-cake'])
  })
})
