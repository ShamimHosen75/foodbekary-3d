import { metaFor, prerenderPaths } from './meta'

describe('page meta', () => {
  it('covers home, 4 categories and 26 products for prerendering', () => {
    expect(prerenderPaths).toHaveLength(31)
    expect(new Set(prerenderPaths).size).toBe(31)
  })

  it('gives every prerendered page a unique title and a description', () => {
    const titles = prerenderPaths.map((p) => metaFor(p).title)
    expect(new Set(titles).size).toBe(titles.length)
    for (const p of prerenderPaths) expect(metaFor(p).description.length, p).toBeGreaterThan(40)
  })

  it('product pages carry price + availability structured data with absolute URLs', () => {
    const m = metaFor('/product/mango-cream-cake')
    expect(m.type).toBe('product')
    expect(m.title).toContain('৳ 2,100')
    expect(m.jsonLd?.offers).toMatchObject({ priceCurrency: 'BDT', price: 2100, availability: 'https://schema.org/OutOfStock' })
    expect(m.image).toMatch(/^https:\/\//)
  })

  it('marks private and unknown pages noindex', () => {
    for (const p of ['/checkout', '/order/FB-1', '/design', '/nope', '/menu/bogus', '/product/nope']) expect(metaFor(p).noindex, p).toBe(true)
    expect(metaFor('/').noindex).toBeUndefined()
  })
})
