import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Lift + terracotta border on hover/focus-within, as on the reference cards. */
  interactive?: boolean
  as?: ElementType
}

export function Card({ interactive = false, as: Tag = 'div', className, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        'group/card relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:border-accent hover:shadow-lift focus-within:-translate-y-1 focus-within:border-accent focus-within:shadow-lift',
        className,
      )}
      {...props}
    />
  )
}
