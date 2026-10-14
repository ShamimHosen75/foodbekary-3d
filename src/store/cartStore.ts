import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartLine {
  productId: string
  qty: number
}

interface CartState {
  lines: CartLine[]
  add: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
}

export const MAX_QTY_PER_LINE = 20

const clampQty = (qty: number) => Math.max(0, Math.min(MAX_QTY_PER_LINE, Math.floor(qty)))

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (productId, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === productId)
          if (!existing) return { lines: [...s.lines, { productId, qty: clampQty(qty) }] }
          return {
            lines: s.lines.map((l) =>
              l.productId === productId ? { ...l, qty: clampQty(l.qty + qty) } : l,
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
