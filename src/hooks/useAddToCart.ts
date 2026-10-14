import { useCallback } from 'react'
import type { Product } from '../data/products'
import { isSoldOut } from '../lib/pricing'
import { MAX_QTY_PER_LINE, useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import { useUiStore } from '../store/uiStore'

/** Highest quantity that may be in the cart for this product. */
export const maxOrderable = (p: Product) => Math.min(p.stock, MAX_QTY_PER_LINE)

/**
 * Adds to the cart with stock limits, confirms with a toast and, if asked,
 * opens the cart drawer (as the reference does after Quick View).
 */
export function useAddToCart() {
  const add = useCartStore((s) => s.add)
  const toast = useToastStore((s) => s.push)
  const openPanel = useUiStore((s) => s.open)

  return useCallback(
    (product: Product, qty = 1, { openCart = false } = {}) => {
      if (isSoldOut(product)) return
      const inCart = useCartStore.getState().lines.find((l) => l.productId === product.id)?.qty ?? 0
      const room = maxOrderable(product) - inCart
      if (room <= 0) {
        toast(`You already have the maximum of “${product.name}” in your cart`, '⚠️')
        return
      }
      const added = Math.min(qty, room)
      add(product.id, added, maxOrderable(product))
      toast(added < qty ? `Only ${added} more “${product.name}” could be added — that’s today’s stock` : `“${product.name}” added to your cart`)
      if (openCart) openPanel('cart')
    },
    [add, toast, openPanel],
  )
}
