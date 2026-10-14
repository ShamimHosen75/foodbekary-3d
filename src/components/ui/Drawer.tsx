import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useMounted } from '../../hooks/useMounted'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { cn } from '../../lib/cn'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  /** Change when the body content is swapped so focus moves into it. */
  contentKey?: unknown
}

/** Right-hand slide-in panel: cart, menu and the utility panels share it. */
export function Drawer({ open, onClose, title, children, footer, className, contentKey }: DrawerProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const mounted = useMounted()
  useLockBodyScroll(open)
  useFocusTrap(panelRef, open, contentKey)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!mounted) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <m.div
            data-testid="drawer-backdrop"
            className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              'absolute inset-y-0 right-0 flex w-full max-w-[22rem] flex-col bg-surface shadow-float',
              className,
            )}
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
          >
            <header className="flex items-center justify-between border-b border-line bg-sand px-5 py-4">
              <h2 id={titleId} className="text-xl font-semibold">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 cursor-pointer place-items-center rounded-full text-lg text-ink transition-colors hover:bg-ink/5"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
            {footer && <div className="border-t border-line bg-surface px-5 py-4">{footer}</div>}
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
