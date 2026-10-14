// Phase 7 browser QA: prerendered pages are complete without JS, hydrate without
// mismatches, keep saved state, and client-only routes still work.
// Usage: node scripts/qa-prerender.mjs [baseUrl]   (serve with: node scripts/serve.mjs)
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
const results = []
const assert = (c, m) => { if (!c) throw new Error(m) }
async function test(name, fn) {
  try { await fn(); results.push(`PASS  ${name}`) } catch (e) { results.push(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`) }
}
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1])

await test(`sitemap lists ${paths.length} pages; robots.txt points to it`, async () => {
  assert(paths.length === 31, `${paths.length} urls`)
  assert((await (await fetch(`${base}/robots.txt`)).text()).includes('Sitemap:'), 'robots.txt')
})

await test('every prerendered page shows its h1, content and images with JavaScript OFF', async () => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } })
  const p = await ctx.newPage()
  for (const path of paths) {
    await p.goto(base + path)
    const h1 = (await p.locator('h1').first().textContent())?.trim()
    assert(h1, `${path}: no h1`)
    // Present is not enough — the main heading must be laid out and visible.
    // (Home's h1 is screen-reader-only by design; its visible title is the hero h2.)
    const visibleTitle = path === '/' ? p.locator('section[aria-label="Our story"] h2').first() : p.locator('h1').first()
    const box = await visibleTitle.boundingBox()
    assert(box && box.height > 10 && (await visibleTitle.isVisible()), `${path}: main heading not visible without JS`)
    assert((await p.locator('#root [hidden], #root template').count()) === 0, `${path}: hidden/streamed fragments in HTML`)
    if (path.startsWith('/menu/')) assert((await p.locator('[data-testid="product-grid"] article').first().isVisible()), `${path}: grid not visible`)
    const title = await p.title()
    assert(title.includes('Foodbekary') && title.length > 15, `${path}: title "${title}"`)
    const hiddenImgs = await p.evaluate(() => [...document.querySelectorAll('main img')].filter((i) => i.getBoundingClientRect().top < innerHeight && Number(getComputedStyle(i).opacity) === 0 && !i.closest('[aria-hidden]')).length)
    assert(hiddenImgs === 0, `${path}: ${hiddenImgs} above-fold images invisible without JS`)
  }
  await ctx.close()
})

await test('every prerendered page hydrates with zero console errors/warnings (no mismatches)', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const p = await ctx.newPage()
  const errs = []
  p.on('console', (m) => ['error', 'warning'].includes(m.type()) && errs.push(`${p.url()}: ${m.text().slice(0, 160)}`))
  p.on('pageerror', (e) => errs.push(`${p.url()}: ${e.message}`))
  for (const path of paths) {
    await p.goto(base + path, { waitUntil: 'networkidle' })
    await p.waitForTimeout(150)
  }
  assert(errs.length === 0, errs.slice(0, 3).join(' || '))
  await ctx.close()
})

await test('hydrated page is interactive and saved cart/favourites appear after load', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  await ctx.addInitScript(() => {
    localStorage.setItem('foodbekary-cart', JSON.stringify({ state: { lines: [{ productId: 'tiramisu-cup', qty: 2 }] }, version: 1 }))
    localStorage.setItem('foodbekary-favorites', JSON.stringify({ state: { ids: ['red-velvet-slice'] }, version: 1 }))
  })
  const p = await ctx.newPage()
  const errs = []
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  await p.goto(base + '/menu/pastries', { waitUntil: 'networkidle' })
  await p.getByTestId('cart-count').filter({ hasText: '2' }).waitFor({ timeout: 4000 })
  assert((await p.getByRole('button', { name: 'Remove Red Velvet Slice from favourites' }).count()) === 1, 'favourite not restored')
  await p.getByRole('button', { name: 'Add to Cart: Tiramisu Cup' }).click()
  await p.getByTestId('cart-count').filter({ hasText: '3' }).waitFor()
  await p.getByRole('group', { name: 'Filter products' }).getByRole('button', { name: 'Red Velvet' }).click()
  await p.getByTestId('product-grid').locator('article').first().waitFor()
  assert((await p.getByTestId('product-grid').locator('article').count()) === 1, 'filter after hydration')
  assert(errs.length === 0, errs.join(' | '))
  await ctx.close()
})

await test('no hydration mismatch with saved state or query strings (cart, favourites, ?f=&q=)', async () => {
  const cases = [
    ['/menu/macarons', { favs: ['pistachio-macaron'] }],
    ['/product/lotus-biscoff-cake', { cart: [{ productId: 'lotus-biscoff-cake', qty: 2 }] }],
    ['/menu/cakes?f=chocolate&q=truffle', {}, 'Dark Truffle Drip Cake'],
    ['/product/tiramisu-cup?utm_source=whatsapp', {}],
  ]
  for (const [path, state, onlyCard] of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    await ctx.addInitScript((st) => {
      if (st.cart) localStorage.setItem('foodbekary-cart', JSON.stringify({ state: { lines: st.cart }, version: 1 }))
      if (st.favs) localStorage.setItem('foodbekary-favorites', JSON.stringify({ state: { ids: st.favs }, version: 1 }))
    }, state)
    const p = await ctx.newPage()
    const errs = []
    p.on('pageerror', (e) => errs.push(e.message.slice(0, 120)))
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 120)))
    await p.goto(base + path, { waitUntil: 'networkidle' })
    await p.waitForTimeout(300)
    assert(errs.length === 0, `${path}: ${errs.join(' | ')}`)
    if (onlyCard) {
      const cards = await p.getByTestId('product-grid').locator('article h3').allInnerTexts()
      assert(cards.join() === onlyCard, `${path}: ${cards.join()}`)
    }
    await ctx.close()
  }
})

await test('client-only routes (checkout, receipt, 404) render from the shell', async () => {
  const p = await browser.newPage()
  await p.goto(base + '/checkout', { waitUntil: 'networkidle' })
  await p.getByRole('heading', { name: 'Your basket is empty' }).waitFor()
  await p.goto(base + '/order/FB-NOPE', { waitUntil: 'networkidle' })
  await p.getByRole('heading', { name: 'We can’t find that receipt.' }).waitFor()
  await p.goto(base + '/no/such/page', { waitUntil: 'networkidle' })
  await p.getByRole('heading', { name: 'This tray is empty.' }).waitFor()
  assert((await p.locator('meta[name="robots"]').getAttribute('content')) === 'noindex', '404 not noindex')
  await p.close()
})

await test('client navigation updates title, description, canonical and JSON-LD', async () => {
  const p = await browser.newPage()
  await p.goto(base + '/', { waitUntil: 'networkidle' })
  await p.locator('footer').getByRole('link', { name: /French Macarons/ }).click()
  await p.waitForURL('**/menu/macarons')
  await p.waitForTimeout(200)
  assert((await p.title()) === 'The Macaron Bar | Foodbekary', await p.title())
  assert((await p.locator('link[rel="canonical"]').getAttribute('href')).endsWith('/menu/macarons'), 'canonical')
  assert((await p.locator('script[type="application/ld+json"]').count()) === 0, 'stale JSON-LD left from home')
  await p.getByRole('link', { name: 'Pistachio Macaron' }).click()
  await p.waitForURL('**/product/pistachio-macaron')
  await p.waitForTimeout(200)
  assert((await p.locator('script[type="application/ld+json"]').textContent()).includes('"@type":"Product"'), 'product JSON-LD')
  assert((await p.locator('meta[property="og:image"]').getAttribute('content')).includes('pistachio-macaron'), 'og:image')
  await p.close()
})

await browser.close()
console.log(results.join('\n'))
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0)
