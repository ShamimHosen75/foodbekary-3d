import { create } from 'zustand'

export type Panel = 'menu' | 'cart' | 'search' | 'favorites' | 'orders'

interface UiState {
  panel: Panel | null
  open: (panel: Panel) => void
  close: () => void
  /** Product id shown in the Quick View modal. */
  quickView: string | null
  openQuickView: (productId: string) => void
  closeQuickView: () => void
}

/** Only one overlay is open at a time; opening another replaces it. */
export const useUiStore = create<UiState>()((set) => ({
  panel: null,
  open: (panel) => set({ panel, quickView: null }),
  close: () => set({ panel: null }),
  quickView: null,
  openQuickView: (quickView) => set({ quickView, panel: null }),
  closeQuickView: () => set({ quickView: null }),
}))
