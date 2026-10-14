import { useOpenStatus } from '../../hooks/useOpenStatus'
import { cn } from '../../lib/cn'

export function OpenStatusPill({ className }: { className?: string }) {
  const open = useOpenStatus()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', open ? 'bg-success' : 'bg-danger')}
      />
      {open ? 'Open' : 'Closed'}
    </span>
  )
}
