import { prerender } from 'react-dom/static'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom'
import { AppProviders } from './App'
import { routes } from './routes'

export { metaFor, prerenderPaths } from './seo/meta'

async function renderOnce(path: string): Promise<string> {
  const handler = createStaticHandler(routes)
  const context = await handler.query(new Request(`http://localhost${path}`))
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${path}`)
  const router = createStaticRouter(handler.dataRoutes, context)
  const { prelude } = await prerender(
    <AppProviders>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </AppProviders>,
    // Never outline large Suspense boundaries for "streaming": a static file must be complete inline.
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  )
  return new Response(prelude).text()
}

/**
 * Renders one path to HTML at build time. The first pass makes React.lazy load the
 * page chunk; the second renders it synchronously. Combined with an unlimited
 * progressiveChunkSize this yields fully inline HTML — never a fallback plus a hidden
 * block swapped in by script (invisible without JS, a layout shift with it).
 */
export async function render(path: string): Promise<string> {
  await renderOnce(path)
  const html = await renderOnce(path)
  if (html.includes('<!--$?-->') || /<div hidden id="S:/.test(html)) {
    throw new Error(`Prerender of ${path} still contains a pending Suspense boundary`)
  }
  return html
}
