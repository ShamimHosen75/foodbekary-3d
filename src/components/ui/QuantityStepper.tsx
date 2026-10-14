import { cn } from '../../lib/cn'

export interface QuantityStepperProps {
  value: number
  onChange: (next: number) => void
  min?: number
  max: number
  /** What is being counted, for screen readers ("Chocolate cake"). */
  label: string
  size?: 'sm' | 'md'
  disabled?: boolean
}

export function QuantityStepper({ value, onChange, min = 1, max, label, size = 'md', disabled }: QuantityStepperProps) {
  const btn = cn(
    'grid cursor-pointer place-items-center rounded-full font-bold text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35',
    size === 'sm' ? 'size-7 text-sm' : 'size-9 text-base',
  )
  return (
    <div
      role="group"
      aria-label={`Quantity for ${label}`}
      className={cn('inline-flex items-center rounded-full border border-line bg-surface', size === 'sm' ? 'p-0.5' : 'p-1')}
    >
      <button type="button" className={btn} aria-label="Decrease quantity" disabled={disabled || value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        <span aria-hidden="true">−</span>
      </button>
      <output aria-live="polite" className={cn('text-center font-semibold tabular-nums', size === 'sm' ? 'w-6 text-sm' : 'w-8')}>
        {value}
      </output>
      <button type="button" className={btn} aria-label="Increase quantity" disabled={disabled || value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        <span aria-hidden="true">+</span>
      </button>
    </div>
  )
}
