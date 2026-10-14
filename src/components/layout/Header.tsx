import { useEffect, useState } from 'react'
import { cn } from '../../lib/cn'
import { CategoryTabs } from './CategoryTabs'
import { HeaderActions } from './HeaderActions'
import { OpenStatusPill } from './OpenStatusPill'
import { Wordmark } from './Wordmark'

export type HeaderVariant = 'home' | 'category'

/**
 * Sticky translucent header. "home" is full-width with a Menu button;
 * "category" is narrower with the category tab group (REFERENCE_ANALYSIS.md §2.1).
 */
export function Header({ variant }: { variant: HeaderVariant }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = variant === 'home'
  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-cream/80 backdrop-blur-md transition-[border-color,box-shadow] duration-300',
        scrolled ? 'border-line shadow-[0_6px_20px_-16px_rgb(44_35_26/0.4)]' : 'border-transparent',
      )}
    >
      <div
        className={cn(
          'mx-auto flex h-14 w-full items-center justify-between gap-4 px-4 sm:px-6',
          isHome ? 'max-w-[90rem] lg:px-8' : 'max-w-[64rem]',
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Wordmark />
          <OpenStatusPill />
        </div>
        {!isHome && <CategoryTabs className="hidden md:block" />}
        <HeaderActions showMenu={isHome} />
      </div>
      {!isHome && (
        <div className="overflow-x-auto px-4 pb-2.5 md:hidden [scrollbar-width:none]">
          <CategoryTabs className="mx-auto w-max" />
        </div>
      )}
    </header>
  )
}
