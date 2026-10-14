import { cn } from '../../lib/cn'

export const inputClass = (invalid: boolean) =>
  cn(
    'w-full rounded-xl border bg-surface px-4 py-3 text-[0.9375rem] text-ink placeholder:text-muted/80 focus:outline-none focus:ring-2',
    invalid ? 'border-danger focus:ring-danger/25' : 'border-line focus:border-ink/40 focus:ring-ink/10',
  )

/** aria props for a control inside <Field>. */
export const describedBy = (id: string, error?: string, hint?: string) => ({
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
})
