import type { ReactNode } from 'react'

export interface FieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: ReactNode
}

/** Label + control + hint/error wiring. The control must use `${id}-hint` / `${id}-error` ids. */
export function Field({ id, label, hint, error, optional, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {/* Hint and error share one line box so swapping them never shifts the layout mid-click. */}
      {error ? (
        <p id={`${id}-error`} className="text-xs leading-4 font-semibold text-danger">
          <span aria-hidden="true" className="mr-1 inline-grid size-3 place-items-center rounded-full bg-danger align-[-2px] text-[0.625rem] leading-none text-white">!</span>
          {error}
        </p>
      ) : (
        hint && <p id={`${id}-hint`} className="text-xs leading-4 text-muted">{hint}</p>
      )}
    </div>
  )
}
