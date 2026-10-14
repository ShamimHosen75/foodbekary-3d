import { useEffect } from 'react'

/** Locks page scroll while `locked`, compensating for the scrollbar to avoid layout shift. */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const { style } = document.body
    const prev = { overflow: style.overflow, paddingRight: style.paddingRight }
    const gutter = window.innerWidth - document.documentElement.clientWidth
    style.overflow = 'hidden'
    if (gutter > 0) style.paddingRight = `${gutter}px`
    return () => {
      style.overflow = prev.overflow
      style.paddingRight = prev.paddingRight
    }
  }, [locked])
}
