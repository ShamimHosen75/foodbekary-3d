import { m, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const itemReduced: Variants = { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.3 } } }

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay before this element animates in, in seconds. */
  delay?: number
}

/** Fades + slides its content up the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <m.div
      className={className}
      variants={reduce ? itemReduced : item}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </m.div>
  )
}

/** Container that staggers its <RevealItem> children. */
export function RevealGroup({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' }) {
  const Tag = as === 'ul' ? m.ul : m.div
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ shown: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </Tag>
  )
}

export function RevealItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const reduce = useReducedMotion()
  const Tag = as === 'li' ? m.li : m.div
  return (
    <Tag className={className} variants={reduce ? itemReduced : item}>
      {children}
    </Tag>
  )
}
