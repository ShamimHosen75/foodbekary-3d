import { Suspense, use, type ComponentType } from 'react'
import type { RouteObject } from 'react-router-dom'
import { RootLayout, type RouteHandle } from './components/layout/RootLayout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

interface PageEntry {
  preload: () => Promise<void>
  Page: ComponentType
}

/**
 * Code-split page. Unlike React.lazy, once its chunk is loaded it renders
 * synchronously — so preloading before the first render (see main.tsx) means no
 * Suspense fallback flash and no layout shift on client-rendered pages.
 */
function page<T extends Record<string, ComponentType>>(load: () => Promise<T>, name: keyof T): PageEntry {
  let Loaded: ComponentType | null = null
  let pending: Promise<void> | null = null
  const preload = () => (pending ??= load().then((m) => void (Loaded = m[name] as ComponentType)))
  function Page() {
    // `preload()` returns the same cached promise every time, as `use` requires.
    if (!Loaded) use(preload())
    return Loaded ? <Loaded /> : null
  }
  return { preload, Page }
}

const CategoryPage = page(() => import('./pages/CategoryPage'), 'CategoryPage')
const ProductPage = page(() => import('./pages/ProductPage'), 'ProductPage')
const CheckoutPage = page(() => import('./pages/CheckoutPage'), 'CheckoutPage')
const OrderConfirmationPage = page(() => import('./pages/OrderConfirmationPage'), 'OrderConfirmationPage')
const DesignSystemPage = page(() => import('./pages/DesignSystemPage'), 'DesignSystemPage')

const pagesByPath: [RegExp, PageEntry][] = [
  [/^\/menu\/[^/]+\/?$/, CategoryPage],
  [/^\/product\/[^/]+\/?$/, ProductPage],
  [/^\/checkout\/?$/, CheckoutPage],
  [/^\/order\/[^/]+\/?$/, OrderConfirmationPage],
  [/^\/design\/?$/, DesignSystemPage],
]

/** Load the chunk for `pathname` (if it is a code-split page). */
export const preloadPage = (pathname: string) =>
  pagesByPath.find(([re]) => re.test(pathname))?.[1].preload() ?? Promise.resolve()

/** Warm every page chunk so later navigations render instantly. */
export const preloadAllPages = () => Promise.all(pagesByPath.map(([, p]) => p.preload()))

/** Reserve roughly a screen of space while a page chunk loads, so the footer doesn't jump. */
const withSuspense = ({ Page }: PageEntry) => (
  <Suspense fallback={<div className="min-h-[80vh]" aria-busy="true" />}>
    <Page />
  </Suspense>
)

const home: RouteHandle = { header: 'home' }

/** Shared by the browser router (main.tsx) and the build-time prerenderer (entry-server.tsx). */
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage />, handle: home },
      { path: '/menu/:category', element: withSuspense(CategoryPage) },
      { path: '/product/:slug', element: withSuspense(ProductPage) },
      { path: '/checkout', element: withSuspense(CheckoutPage) },
      { path: '/order/:id', element: withSuspense(OrderConfirmationPage) },
      { path: '/design', element: withSuspense(DesignSystemPage) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
