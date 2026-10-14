import type { ReactNode } from 'react'

export interface BaseLayoutProps {
  children: ReactNode
  /** Header/footer slots — real ones arrive in Phase 2. */
  header?: ReactNode
  footer?: ReactNode
}

export function BaseLayout({ children, header, footer }: BaseLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {header}
      <main id="main" className="flex-1">
        {children}
      </main>
      {footer}
    </div>
  )
}
