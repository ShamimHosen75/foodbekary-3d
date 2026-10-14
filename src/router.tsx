import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout, type RouteHandle } from './components/layout/RootLayout'
import { CategoryPage } from './pages/CategoryPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductPage } from './pages/ProductPage'

const DesignSystemPage = lazy(() =>
  import('./pages/DesignSystemPage').then((m) => ({ default: m.DesignSystemPage })),
)

const home: RouteHandle = { header: 'home' }

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage />, handle: home },
      { path: '/menu/:category', element: <CategoryPage /> },
      { path: '/product/:slug', element: <ProductPage /> },
      {
        path: '/design',
        element: (
          <Suspense fallback={<div className="min-h-[60vh]" />}>
            <DesignSystemPage />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
