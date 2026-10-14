import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { cn } from '../../lib/cn'

export function Wordmark({ className, suffix }: { className?: string; suffix?: string }) {
  return (
    <Link
      to="/"
      aria-label={`${site.name} — home`}
      className={cn('font-display text-xl font-bold tracking-[-0.01em] text-ink', className)}
    >
      {site.wordmark.lead}
      <span className="text-accent-ink">{site.wordmark.accent}</span>
      {suffix && <span> {suffix}</span>}
    </Link>
  )
}
