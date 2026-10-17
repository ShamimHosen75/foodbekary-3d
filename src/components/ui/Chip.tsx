import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state, exposed to assistive tech via aria-pressed. */
  active?: boolean
}

/** Pill toggle used for filters and the category tab group. */
export function Chip({ active = false, className, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap',
        'transition-[background-color,color,border-color] duration-200 ease-out-soft',
        active
          ? 'border-accent-strong bg-accent-strong text-white'
          : 'border-line bg-surface text-ink hover:border-accent',
        className,
      )}
      {...props}
    />
  )
}
