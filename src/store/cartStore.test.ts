import { MAX_QTY_PER_LINE, selectCartCount, useCartStore } from './cartStore'

beforeEach(() => useCartStore.getState().clear())

describe('cartStore', () => {
  it('merges repeat adds into one line and counts total quantity', () => {
    const { add } = useCartStore.getState()
    add('cookie', 1)
    add('cake', 3)
    add('cookie', 1)
    const s = useCartStore.getState()
    expect(s.lines).toEqual([
      { productId: 'cookie', qty: 2 },
      { productId: 'cake', qty: 3 },
    ])
    expect(selectCartCount(s)).toBe(5)
  })

  it('caps quantity per line and drops lines set to zero', () => {
    const { add, setQty } = useCartStore.getState()
    add('cake', 999)
    expect(useCartStore.getState().lines[0]?.qty).toBe(MAX_QTY_PER_LINE)
    setQty('cake', 0)
    expect(useCartStore.getState().lines).toEqual([])
  })

  it('persists to localStorage', () => {
    useCartStore.getState().add('cake', 2)
    expect(localStorage.getItem('foodbekary-cart')).toContain('"qty":2')
  })
})
