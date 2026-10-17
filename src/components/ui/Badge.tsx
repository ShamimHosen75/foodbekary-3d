import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type BadgeVariant = 'dark' | 'accent' | 'soft' | 'neutral'

const variants: Record<BadgeVariant, string> = {
  dark: 'bg-surface/90 text-ink border border-line uppercase tracking-[0.08em] text-[0.625rem]',
  accent: 'bg-accent-strong text-white text-[0.6875rem]',
  soft: 'bg-accent-tint text-accent-ink text-[0.6875rem]',
  neutral: 'bg-surface/80 border border-line text-ink text-[0.6875rem]',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = 'dark', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 leading-none font-bold',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
