import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type ContainerSize = 'content' | 'wide' | 'full'

const sizes: Record<ContainerSize, string> = {
  /** Boutique grid width used by the reference (~760px). */
  content: 'max-w-[48rem]',
  wide: 'max-w-[78rem]',
  full: 'max-w-none',
}

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  size?: ContainerSize
  as?: ElementType
}

export function Container({ size = 'content', as: Tag = 'div', className, ...props }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full px-4 sm:px-6', sizes[size], className)} {...props} />
}
