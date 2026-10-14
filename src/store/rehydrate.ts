import { useCartStore } from './cartStore'
import { useFavoritesStore } from './favoritesStore'
import { useOrdersStore } from './ordersStore'

/**
 * Persisted stores start empty (skipHydration) so prerendered HTML matches the
 * first client render; this loads the saved cart, favourites and orders.
 */
export function rehydrateStores(): void {
  void useCartStore.persist.rehydrate()
  void useFavoritesStore.persist.rehydrate()
  void useOrdersStore.persist.rehydrate()
}
