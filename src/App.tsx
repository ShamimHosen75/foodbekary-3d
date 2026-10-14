import { LazyMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Animation features (domMax: animations, gestures, layout) load in their own chunk after first paint. */
const loadFeatures = () => import('./lib/motionFeatures').then((m) => m.default)

/**
 * Providers shared by the browser app and the build-time prerenderer.
 * LazyMotion + `m.*` components keep the animation engine out of the initial bundle.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  )
}
