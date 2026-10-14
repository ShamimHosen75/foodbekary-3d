import { AnimatePresence, m } from 'framer-motion'
import { useToastStore } from '../../store/toastStore'

/** Bottom-right confirmations ("… added to your cart"). Announced politely to screen readers. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed right-4 bottom-[calc(1rem+var(--bottom-bar,0px))] left-4 z-[60] flex flex-col items-end gap-2 sm:left-auto">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <m.button
            key={t.id}
            type="button"
            layout
            onClick={() => dismiss(t.id)}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex max-w-sm cursor-pointer items-center gap-2 rounded-xl bg-ink px-4 py-3 text-left text-sm font-medium text-white shadow-float"
          >
            <span aria-hidden="true">{t.icon}</span>
            {t.message}
          </m.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
