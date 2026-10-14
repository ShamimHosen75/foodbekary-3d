import { useId, useState, type FormEvent } from 'react'
import { Button } from '../ui'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** No backend yet — validates and confirms locally. Wire to a provider in Phase 7. */
export function FooterNewsletter() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setState(EMAIL.test(email.trim()) ? 'done' : 'error')
  }

  if (state === 'done') {
    return (
      <p role="status" className="rounded-xl bg-white/5 px-4 py-3 text-sm text-forest-ink">
        🎉 You’re on the list — watch your inbox for the next fresh batch.
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <label htmlFor={id} className="sr-only">Email address</label>
      <div className="flex gap-2">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email…"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          aria-invalid={state === 'error'}
          aria-describedby={state === 'error' ? `${id}-err` : undefined}
          className="h-10 min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-forest-ink/85 focus:border-gold focus:outline-none"
        />
        <Button type="submit" variant="gold" className="h-10 shrink-0">Subscribe</Button>
      </div>
      {state === 'error' && (
        <p id={`${id}-err`} className="text-xs text-[#f3b4a0]">Please enter a valid email address.</p>
      )}
    </form>
  )
}
