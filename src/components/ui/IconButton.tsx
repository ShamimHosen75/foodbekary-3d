import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name — icon buttons have no visible text. */
  label: string
  children: ReactNode
}

export function IconButton({ label, className, children, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-grid size-9 cursor-pointer place-items-center rounded-full border border-line bg-surface/80 text-base',
        'transition-[transform,border-color,background-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-ink/30 active:scale-95',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  )
}
