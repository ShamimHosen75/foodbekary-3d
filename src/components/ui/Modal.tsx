import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useMounted } from '../../hooks/useMounted'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'

export interface ModalProps {
  open: boolean
  onClose: () => void
  /** id of the element that names the dialog (usually its heading). */
  labelledBy: string
  children: ReactNode
  contentKey?: unknown
}

/** Centred dialog (Quick View). Bottom sheet on small screens. */
export function Modal({ open, onClose, labelledBy, children, contentKey }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const mounted = useMounted()
  useLockBodyScroll(open)
  useFocusTrap(ref, open, contentKey)

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
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <m.div
            data-testid="modal-backdrop"
            className="absolute inset-0 bg-ink/40 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className="relative max-h-[92dvh] w-full max-w-[56rem] overflow-y-auto overscroll-contain rounded-t-(--radius-modal) border border-line bg-sand shadow-float sm:rounded-(--radius-modal)"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 grid size-9 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-cream"
            >
              <span aria-hidden="true">✕</span>
            </button>
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
