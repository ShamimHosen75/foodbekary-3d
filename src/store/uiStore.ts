import { create } from 'zustand'

export type Panel = 'menu' | 'cart' | 'search' | 'favorites' | 'orders'

interface UiState {
  panel: Panel | null
  open: (panel: Panel) => void
  close: () => void
}

/** Only one overlay is open at a time; opening another replaces it. */
export const useUiStore = create<UiState>()((set) => ({
  panel: null,
  open: (panel) => set({ panel }),
  close: () => set({ panel: null }),
}))
