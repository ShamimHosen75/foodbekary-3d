import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
}

/** Pill search input with a clear button. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { label, value, onChange, className, ...props },
  ref,
) {
  const id = useId()
  return (
    <div className={cn('relative w-full max-w-[22rem]', className)}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm">🔍</span>
      <input
        ref={ref}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        className="h-11 w-full rounded-full border border-line bg-surface pr-10 pl-10 text-sm text-ink shadow-card placeholder:text-muted focus:border-ink/40 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-xs text-muted hover:bg-cream hover:text-ink"
        >
          <span aria-hidden="true">✕</span>
        </button>
      )}
    </div>
  )
})
