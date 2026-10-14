import { motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router-dom'
import { useUiStore } from '../../store/uiStore'
import { PanelHost } from '../panels/PanelHost'
import { QuickViewModal } from '../product/QuickViewModal'
import { BaseLayout } from './BaseLayout'
import { Footer } from './Footer'
import { Header, type HeaderVariant } from './Header'
import { Toaster } from './Toaster'

export interface RouteHandle {
  header?: HeaderVariant
}

export function RootLayout() {
  const matches = useMatches()
  const handle = matches[matches.length - 1]?.handle as RouteHandle | undefined
  const open = useUiStore((s) => s.open)
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  // Ctrl/⌘ + K opens search from anywhere, as advertised in the footer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        open('search')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <BaseLayout header={<Header variant={handle?.header ?? 'category'} />} footer={<Footer />}>
      {/* Gentle fade-in per page. No exit animation, so navigation never waits and scroll restoration stays exact. */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: reduce ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
      <PanelHost />
      <QuickViewModal />
      <Toaster />
      <ScrollRestoration />
    </BaseLayout>
  )
}
