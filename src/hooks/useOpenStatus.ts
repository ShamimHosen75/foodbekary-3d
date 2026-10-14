import { useEffect, useState } from 'react'
import { site } from '../data/site'
import { isOpenAt } from '../lib/openStatus'

const checkNow = () => isOpenAt(new Date(), site.hours.open, site.hours.close)

/**
 * Live open/closed flag, re-checked every minute. `null` until running in the
 * browser: prerendered HTML is built ahead of time, so it can't know the hour.
 */
export function useOpenStatus(): boolean | null {
  const [open, setOpen] = useState<boolean | null>(null)
  useEffect(() => {
    setOpen(checkNow())
    const id = window.setInterval(() => setOpen(checkNow()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return open
}
