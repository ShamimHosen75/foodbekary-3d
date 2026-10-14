import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

/** Static outline pill — hero chips, ingredient lists, features. */
export function Tag({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink',
        className,
      )}
      {...props}
    />
  )
}
