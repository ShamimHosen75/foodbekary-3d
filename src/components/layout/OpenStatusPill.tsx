import { useOpenStatus } from '../../hooks/useOpenStatus'
import { cn } from '../../lib/cn'

export function OpenStatusPill({ className }: { className?: string }) {
  const open = useOpenStatus()
  return (
    <span
      className={cn(
        // Fixed min-width so switching from the placeholder to Open/Closed never shifts the header.
        'inline-flex min-w-[4.25rem] items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full transition-colors', open === null ? 'bg-line' : open ? 'bg-success' : 'bg-danger')}
      />
      {open === null ? <span className="text-muted">Hours</span> : open ? 'Open' : 'Closed'}
    </span>
  )
}
