import { resolveCart } from './cart'

describe('resolveCart', () => {
  it('prices lines with sale prices and sums the subtotal', () => {
    const cart = resolveCart([
      { productId: 'classic-chocolate-chunk', qty: 1 }, // 120
      { productId: 'dark-truffle-drip-cake', qty: 3 }, // sale 2300 × 3
    ])
    expect(cart.items.map((i) => i.lineTotal)).toEqual([120, 6900])
    expect(cart.subtotal).toBe(7020)
    expect(cart.count).toBe(4)
  })

  it('drops products that no longer exist', () => {
    expect(resolveCart([{ productId: 'ghost', qty: 2 }]).items).toEqual([])
  })

  it('reduces quantities above today’s stock and flags them', () => {
    const [item] = resolveCart([{ productId: 'lotus-biscoff-cake', qty: 5 }]).items // stock 2
    expect(item?.qty).toBe(2)
    expect(item?.issue).toBe('reduced')
    expect(item?.lineTotal).toBe(5400)
  })

  it('keeps sold-out items visible but excludes them from totals', () => {
    const cart = resolveCart([
      { productId: 'mango-cream-cake', qty: 1 },
      { productId: 'raspberry-macaron', qty: 2 },
    ])
    expect(cart.items[0]?.issue).toBe('sold-out')
    expect(cart.orderable).toHaveLength(1)
    expect(cart.subtotal).toBe(180)
    expect(cart.count).toBe(2)
  })
})
