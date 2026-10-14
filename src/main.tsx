import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AppProviders } from './App'
import { hydration } from './lib/hydration'
import { preloadAllPages, preloadPage, routes } from './routes'
import { rehydrateStores } from './store/rehydrate'

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found')

const app = (
  <StrictMode>
    <AppProviders>
      <RouterProvider router={createBrowserRouter(routes)} />
    </AppProviders>
  </StrictMode>
)

// Load this page's code first so the first render is complete (no fallback flash/shift).
await preloadPage(location.pathname)

if (hydration.active) {
  // Prerendered page: adopt the existing HTML. Saved cart/favourites/orders load in
  // RootLayout's effect, i.e. only after hydration has committed (earlier = mismatch).
  hydrateRoot(root, app)
} else {
  // Client-only page (checkout, receipts, 404 fallback, or a prerendered page opened
  // with a query string): drop any prerendered markup, load saved state, render fresh.
  root.replaceChildren()
  rehydrateStores()
  createRoot(root).render(app)
}

// Warm a page's chunk as soon as the visitor shows intent (hover, focus, touch on a link)…
const warm = (e: Event) => {
  const link = (e.target as Element | null)?.closest?.('a[href^="/"]')
  if (link) void preloadPage(new URL((link as HTMLAnchorElement).href).pathname)
}
for (const type of ['pointerover', 'focusin', 'touchstart'] as const) document.addEventListener(type, warm, { passive: true })

// …and all remaining chunks when the browser is idle, so navigation is instant.
if ('requestIdleCallback' in window) window.requestIdleCallback(() => void preloadAllPages())
else setTimeout(() => void preloadAllPages(), 1500)
