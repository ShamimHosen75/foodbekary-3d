import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'gold'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out-soft ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 cursor-pointer'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-cream hover:bg-accent-strong hover:text-white',
  accent: 'bg-accent-strong text-white hover:bg-accent hover:text-ink shadow-sm',
  outline: 'border border-line bg-surface/80 text-ink hover:border-accent hover:text-accent-ink',
  ghost: 'text-ink hover:bg-surface/70',
  gold: 'bg-gold text-ink hover:bg-surface hover:text-accent',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3.5 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-[0.9375rem]',
}

/** Shared so router <Link>s can look like buttons without a wrapper. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className)
}
