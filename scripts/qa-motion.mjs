// Phase 6 browser QA: animation smoothness under CPU throttling, reduced motion, loading states.
// Usage: node scripts/qa-motion.mjs [baseUrl]
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
const results = []
const errors = []
const assert = (c, m) => { if (!c) throw new Error(m) }
const seedCart = [{ productId: 'dark-truffle-drip-cake', qty: 1 }, { productId: 'nutella-stuffed-cookie', qty: 3 }, { productId: 'pistachio-macaron', qty: 6 }]

async function open(path, { width = 360, height = 780, reducedMotion = 'no-preference', cart, throttle = 1 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion, hasTouch: width < 768 })
  if (cart) await ctx.addInitScript((l) => { try { if (!sessionStorage.getItem('s')) { localStorage.setItem('foodbekary-cart', JSON.stringify({ state: { lines: l }, version: 1 })); sessionStorage.setItem('s', '1') } } catch { /* opaque */ } }, cart)
  const p = await ctx.newPage()
  p.on('console', (m) => ['error', 'warning'].includes(m.type()) && errors.push(`${m.type()}: ${m.text()}`))
  p.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  await p.goto(base + path, { waitUntil: 'networkidle' })
  await p.getByTestId('cart-count').waitFor()
  if (throttle > 1) await (await ctx.newCDPSession(p)).send('Emulation.setCPUThrottlingRate', { rate: throttle })
  return p
}
async function test(name, fn) {
  try { await fn(); results.push(`PASS  ${name}`) } catch (e) { results.push(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`) }
}

/** Records rAF frame gaps + long tasks while `action` runs, then for `settle` ms. */
async function measure(p, action, settle = 900) {
  await p.evaluate(() => {
    window.__gaps = []; window.__long = 0; window.__rec = true
    let last = performance.now()
    const tick = (t) => { if (!window.__rec) return; window.__gaps.push(t - last); last = t; requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
    window.__po = new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__long += e.duration)))
    window.__po.observe({ type: 'longtask' })
  })
  await action()
  await p.waitForTimeout(settle)
  return p.evaluate(() => {
    window.__rec = false; window.__po.disconnect()
    const g = window.__gaps.slice(1).sort((a, b) => a - b)
    const q = (f) => g[Math.min(g.length - 1, Math.floor(g.length * f))]
    return { frames: g.length, median: q(0.5), p95: q(0.95), max: g[g.length - 1], janky: g.filter((x) => x > 50).length, longTaskMs: Math.round(window.__long) }
  })
}
const fmt = (s) => `frames=${s.frames} median=${s.median.toFixed(1)}ms p95=${s.p95.toFixed(1)}ms max=${s.max.toFixed(0)}ms >50ms=${s.janky} longtasks=${s.longTaskMs}ms`
const perf = []
async function perfCase(name, path, action, opts = {}) {
  await test(`smoothness (4× CPU, 360px): ${name}`, async () => {
    const p = await open(path, { throttle: 4, ...opts })
    const s = await measure(p, () => action(p))
    perf.push(`      ${name.padEnd(28)} ${fmt(s)}`)
    assert(s.median <= 20, `median ${s.median.toFixed(1)}ms`)
    assert(s.p95 <= 50, `p95 ${s.p95.toFixed(1)}ms`)
    await p.close()
  })
}

await perfCase('hero scroll', '/', (p) => p.evaluate(async () => {
  const s = document.querySelector('section[aria-label="Our story"]')
  const end = s.offsetTop + s.offsetHeight - innerHeight
  for (let y = 0; y < end; y += 30) { window.scrollTo(0, y); await new Promise((r) => requestAnimationFrame(r)) }
}))
await perfCase('cart drawer open', '/menu/cakes', (p) => p.locator('header').getByRole('button', { name: /^Cart/ }).click(), { cart: seedCart })
await perfCase('quick view open', '/menu/cakes', (p) => p.getByRole('button', { name: 'Quick view: Berry Chantilly Cake' }).click())
await perfCase('filter change (stagger)', '/menu/cakes', (p) => p.getByRole('group', { name: 'Filter products' }).getByRole('button', { name: 'Bestsellers' }).click())
await perfCase('page transition', '/menu/cakes', (p) => p.getByRole('link', { name: 'Berry Chantilly Cake' }).click())
await perfCase('category scroll + reveal', '/', (p) => p.evaluate(async () => {
  const start = document.querySelector('section[aria-labelledby="showcase-title"]').offsetTop - innerHeight
  for (let y = start; y < start + 1800; y += 30) { window.scrollTo(0, y); await new Promise((r) => requestAnimationFrame(r)) }
}))

await test('reduced motion: drawer, modal, page and badge use no movement', async () => {
  const p = await open('/menu/cakes', { width: 1280, height: 860, reducedMotion: 'reduce', cart: seedCart })
  await p.locator('header').getByRole('button', { name: /^Cart/ }).click()
  await p.waitForTimeout(60)
  const drawerT = await p.getByRole('dialog').evaluate((el) => getComputedStyle(el).transform)
  assert(drawerT === 'none', `drawer transform ${drawerT}`)
  await p.keyboard.press('Escape')
  await p.getByRole('dialog').waitFor({ state: 'detached' })
  await p.getByRole('button', { name: 'Quick view: Berry Chantilly Cake' }).click()
  await p.waitForTimeout(60)
  const modalT = await p.getByRole('dialog').evaluate((el) => getComputedStyle(el).transform)
  assert(modalT === 'none', `modal transform ${modalT}`)
  await p.getByRole('dialog').getByRole('button', { name: /Add 1 to Cart/ }).click()
  await p.waitForTimeout(40)
  const badgeT = await p.getByTestId('cart-count').evaluate((el) => getComputedStyle(el).transform)
  assert(badgeT === 'none', `badge transform ${badgeT}`)
  await p.keyboard.press('Escape')
  await p.getByRole('link', { name: 'Dark Truffle Drip Cake' }).first().click()
  await p.waitForTimeout(40)
  const pageT = await p.locator('#main > div').first().evaluate((el) => getComputedStyle(el).transform)
  assert(pageT === 'none', `page transform ${pageT}`)
  const shimmer = await p.evaluate(() => { const d = document.createElement('div'); d.className = 'skeleton'; document.body.append(d); const v = getComputedStyle(d).animationDuration; d.remove(); return v })
  assert(parseFloat(shimmer) < 0.05, `shimmer duration ${shimmer}`)
  await p.close()
})

await test('image loading: shimmer placeholder while slow images load, then fades in', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const p = await ctx.newPage()
  await p.route('**/assets/*-1-640-*.webp', async (r) => { await new Promise((res) => setTimeout(res, 1500)); await r.continue() })
  // Prerendered pages show images immediately by design; the shimmer is for in-app navigation.
  await p.goto(base + '/', { waitUntil: 'networkidle' })
  await p.locator('footer').getByRole('link', { name: /Fresh-baked Cookies/ }).click()
  const first = p.getByTestId('product-grid').locator('article').first().locator('span.skeleton')
  await first.waitFor({ timeout: 3000 })
  await p.waitForFunction(() => document.querySelectorAll('[data-testid="product-grid"] [data-loaded]').length === 6, null, { timeout: 8000 })
  await p.waitForTimeout(600)
  const op = await p.getByTestId('product-grid').locator('article img').first().evaluate((el) => getComputedStyle(el).opacity)
  assert(Number(op) > 0.99, `opacity ${op}`)
  await ctx.close()
})

await test('cart badge bump keeps the right count through rapid adds', async () => {
  const p = await open('/menu/cookies', { width: 1280 })
  const btn = p.getByRole('button', { name: 'Add to Cart: Classic Chocolate Chunk' })
  for (let i = 0; i < 5; i++) await btn.click()
  await p.waitForTimeout(500)
  assert((await p.getByTestId('cart-count').innerText()) === '5', await p.getByTestId('cart-count').innerText())
  await p.close()
})

await test('mobile checkout bar: total matches, submits the form, never hides fields or toasts', async () => {
  const p = await open('/checkout', { cart: seedCart })
  const bar = p.getByTestId('bar-total')
  assert((await bar.innerText()) === (await p.getByTestId('total').innerText()), 'bar total != summary total')
  await p.getByRole('button', { name: 'Place order', exact: true }).click()
  await p.getByText(/Please fix \d fields/).waitFor()
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await p.waitForTimeout(300)
  const gap = await p.evaluate(() => {
    const barTop = innerHeight - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bottom-bar')) * 16
    const last = [...document.querySelectorAll('footer')].pop().getBoundingClientRect()
    return { barTop, lastBottom: last.bottom }
  })
  assert(gap.lastBottom <= gap.barTop + 1, `footer hidden under bar: ${JSON.stringify(gap)}`)
  const toastBottom = await p.locator('[role="status"][aria-live="polite"]').first().evaluate((el) => parseFloat(getComputedStyle(el).bottom))
  assert(toastBottom >= 84, `toasts at bottom ${toastBottom}px`)
  await p.close()
})

await test('desktop: no mobile bar, toasts back at the corner', async () => {
  const p = await open('/checkout', { width: 1280, cart: seedCart })
  assert(!(await p.getByTestId('bar-total').isVisible()), 'bar visible on desktop')
  const b = await p.locator('[role="status"][aria-live="polite"]').first().evaluate((el) => parseFloat(getComputedStyle(el).bottom))
  assert(b === 16, `toast bottom on desktop checkout ${b}`)
  const pad = await p.evaluate(() => getComputedStyle(document.body).paddingBottom)
  assert(pad === '0px', `body padding ${pad}`)
  await p.close()
})

await browser.close()
console.log(results.join('\n'))
console.log('\nFrame timing (rAF gaps, 4× CPU throttle, software rendering):\n' + perf.join('\n'))
console.log(errors.length ? `\nConsole problems:\n${[...new Set(errors)].join('\n')}` : '\nConsole: clean')
process.exit(results.some((r) => r.startsWith('FAIL')) || errors.length ? 1 : 0)
