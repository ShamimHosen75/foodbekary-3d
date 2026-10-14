/**
 * True while React is rendering the very first time over prerendered HTML (and
 * always during server rendering). Components read it in their first render to
 * skip entrance animations and placeholders, so the server HTML and the first
 * client render match exactly and content is visible before JavaScript runs.
 * RootLayout flips it to false once hydration has committed.
 */
const isServer = typeof document === 'undefined'
const hasHtml = !isServer && !!document.getElementById('root')?.firstElementChild
/**
 * Prerendered HTML reflects the bare URL. With a query string (e.g. ?f=chocolate) the
 * first client render differs, so such loads render fresh instead of hydrating.
 */
const hasQuery = !isServer && location.search.length > 1
const fromServer = isServer || (hasHtml && !hasQuery)

export const hydration = {
  active: fromServer,
  /** Whether this page load adopted prerendered HTML (never changes). */
  fromServer,
}
