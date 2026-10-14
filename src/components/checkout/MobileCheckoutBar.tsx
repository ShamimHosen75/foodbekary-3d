import { useEffect } from 'react'
import { formatPrice } from '../../lib/format'
import { Button } from '../ui'

/** Keep in sync with --bottom-bar in index.css. */
const BAR_HEIGHT = '5.25rem'

/**
 * Phone-only bar pinned to the bottom with the total and Place order, so the
 * customer never has to scroll past the summary to submit. Also lifts toasts above it.
 */
export function MobileCheckoutBar({ formId, total, busy, disabled }: { formId: string; total: number; busy: boolean; disabled: boolean }) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('has-bottom-bar') // reserves body padding + lifts toasts (see index.css)
    return () => {
      root.classList.remove('has-bottom-bar')
    }
  }, [])

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 py-3 shadow-[0_-10px_30px_-20px_rgb(44_35_26/0.5)] backdrop-blur-md md:hidden" style={{ height: BAR_HEIGHT }}>
      <div className="flex h-full items-center gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted">Total · Cash on Delivery</p>
          <p className="text-lg font-bold tabular-nums" data-testid="bar-total">{formatPrice(total)}</p>
        </div>
        <Button type="submit" form={formId} size="lg" className="ml-auto" disabled={busy || disabled}>
          {busy ? 'Placing…' : 'Place order'}
        </Button>
      </div>
    </div>
  )
}
