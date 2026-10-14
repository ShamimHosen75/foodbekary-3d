import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartLine {
  productId: string
  qty: number
}

interface CartState {
  lines: CartLine[]
  /** `max` caps the line (e.g. today's stock); defaults to MAX_QTY_PER_LINE. */
  add: (productId: string, qty?: number, max?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
}

export const MAX_QTY_PER_LINE = 20

const clampQty = (qty: number, max = MAX_QTY_PER_LINE) =>
  Math.max(0, Math.min(max, MAX_QTY_PER_LINE, Math.floor(qty)))

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (productId, qty = 1, max) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === productId)
          if (!existing) {
            const first = clampQty(qty, max)
            return first > 0 ? { lines: [...s.lines, { productId, qty: first }] } : s
          }
          return {
            lines: s.lines.map((l) =>
              l.productId === productId ? { ...l, qty: clampQty(l.qty + qty, max) } : l,
            ),
          }
        }),
      setQty: (productId, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.productId === productId ? { ...l, qty: clampQty(qty) } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (productId) => set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'foodbekary-cart', version: 1 },
  ),
)

/** Header badge counts total quantity, as the reference does (1 + 3 = 4). */
export const selectCartCount = (s: CartState) => s.lines.reduce((n, l) => n + l.qty, 0)

/** Quantity of one product already in the cart. */
export const selectQtyInCart = (productId: string) => (s: CartState) =>
  s.lines.find((l) => l.productId === productId)?.qty ?? 0
