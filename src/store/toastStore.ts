import { create } from 'zustand'

export interface Toast {
  id: number
  icon: string
  message: string
}

interface ToastState {
  toasts: Toast[]
  push: (message: string, icon?: string) => void
  dismiss: (id: number) => void
}

let nextId = 1
const LIFETIME_MS = 3200

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (message, icon = '🛒') => {
    const id = nextId++
    // Keep at most three on screen.
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, icon, message }] }))
    window.setTimeout(() => get().dismiss(id), LIFETIME_MS)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
