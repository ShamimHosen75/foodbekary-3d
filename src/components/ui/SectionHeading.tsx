import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'center' | 'left'
  /** Heading level — keep the document outline correct per page. */
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'center',
  as: Heading = 'h2',
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center text-center', className)}>
      {eyebrow && (
        <p className="text-eyebrow font-semibold uppercase text-accent-ink">
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className="max-w-[16ch] text-[2rem] leading-[1.08] font-semibold tracking-[-0.01em] sm:text-[2.5rem]"
      >
        {title}
      </Heading>
      {intro && <p className="max-w-[34rem] text-[0.9375rem] leading-relaxed text-muted">{intro}</p>}
    </div>
  )
}
