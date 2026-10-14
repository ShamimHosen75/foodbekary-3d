import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order } from '../lib/order'

interface OrdersState {
  orders: Order[]
  add: (order: Order) => void
}

/** Receipts kept on this device ("My Orders"). Newest first, capped at 20. */
export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      add: (order) => set((s) => ({ orders: [order, ...s.orders.filter((o) => o.id !== order.id)].slice(0, 20) })),
    }),
    { name: 'foodbekary-orders', version: 1 },
  ),
)
