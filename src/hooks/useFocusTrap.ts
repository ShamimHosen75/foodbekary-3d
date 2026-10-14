import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Keeps Tab focus inside `ref` while active and focuses its first control.
 * Changing `contentKey` (e.g. swapping panel content) re-focuses the new content.
 * On deactivation, focus returns to whatever element opened the trap.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, contentKey?: unknown): void {
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    opener.current = document.activeElement as HTMLElement | null
    return () => {
      opener.current?.focus?.()
      opener.current = null
    }
  }, [active])

  useEffect(() => {
    const root = ref.current
    if (!active || !root) return
    const items = () => [...root.querySelectorAll<HTMLElement>(FOCUSABLE)]
    items()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const list = items()
      const first = list[0]
      const last = list[list.length - 1]
      if (!first || !last) return
      const inside = root.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault()
        first.focus()
      }
    }
    // Listen on document so a focus that slipped to <body> is pulled back in.
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [ref, active, contentKey])
}
