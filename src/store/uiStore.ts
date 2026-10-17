import { create } from 'zustand'

export type Panel = 'menu' | 'cart' | 'search' | 'favorites' | 'orders'
export type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  try {
    const saved = localStorage.getItem('foodbekary_theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return 'dark' // Default is dark theme
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
  if (theme === 'light') {
    document.documentElement.classList.add('theme-light')
  } else {
    document.documentElement.classList.remove('theme-light')
  }
  try {
    localStorage.setItem('foodbekary_theme', theme)
  } catch {}
}

interface UiState {
  panel: Panel | null
  open: (panel: Panel) => void
  close: () => void
  /** Product id shown in the Quick View modal. */
  quickView: string | null
  openQuickView: (productId: string) => void
  closeQuickView: () => void
  /** Active color theme: 'dark' (default) or 'light' (secondary) */
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/** Only one overlay is open at a time; opening another replaces it. */
export const useUiStore = create<UiState>()((set, get) => {
  const initialTheme = getInitialTheme()
  if (typeof window !== 'undefined') {
    applyTheme(initialTheme)
  }

  return {
    panel: null,
    open: (panel) => set({ panel, quickView: null }),
    close: () => set({ panel: null }),
    quickView: null,
    openQuickView: (quickView) => set({ quickView, panel: null }),
    closeQuickView: () => set({ quickView: null }),
    theme: initialTheme,
    setTheme: (theme) => {
      applyTheme(theme)
      set({ theme })
    },
    toggleTheme: () => {
      const next = get().theme === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      set({ theme: next })
    },
  }
})

