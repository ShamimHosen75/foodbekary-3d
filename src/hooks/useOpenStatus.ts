import { useEffect, useState } from 'react'
import { site } from '../data/site'
import { isOpenAt } from '../lib/openStatus'

const checkNow = () => isOpenAt(new Date(), site.hours.open, site.hours.close)

/** Live open/closed flag, re-checked every minute. */
export function useOpenStatus(): boolean {
  const [open, setOpen] = useState(checkNow)
  useEffect(() => {
    const id = window.setInterval(() => setOpen(checkNow()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return open
}
