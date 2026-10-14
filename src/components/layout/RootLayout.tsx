import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom'
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
      <Outlet />
      <PanelHost />
      <QuickViewModal />
      <Toaster />
      <ScrollRestoration />
    </BaseLayout>
  )
}
