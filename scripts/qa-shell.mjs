// Phase 2 browser QA: navigation shell behaviour. Usage: node scripts/qa-shell.mjs [baseUrl]
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
const results = []
const errors = []

async function page(width = 1280) {
  const p = await browser.newPage({ viewport: { width, height: 850 } })
  p.on('console', (m) => ['error', 'warning'].includes(m.type()) && errors.push(`${m.type()}: ${m.text()}`))
  p.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  return p
}
async function test(name, fn) {
  try {
    await fn()
    results.push(`PASS  ${name}`)
  } catch (e) {
    results.push(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`)
  }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg) }
const h1 = (p) => p.locator('h1').first().innerText()
const waitH1 = (p, text) => p.locator('h1', { hasText: text }).first().waitFor({ timeout: 5000 })

await test('mobile 360: Menu opens, Esc closes, focus returns to Menu button', async () => {
  const p = await page(360)
  await p.goto(base + '/')
  const btn = p.getByRole('button', { name: 'Menu', exact: true })
  await btn.click()
  await p.getByRole('dialog', { name: 'Menu' }).waitFor()
  await p.keyboard.press('Escape')
  await p.getByRole('dialog').waitFor({ state: 'detached' })
  assert(await btn.evaluate((el) => el === document.activeElement), 'focus not returned to Menu button')
  await p.close()
})

await test('mobile 360: Menu close button and backdrop close the drawer', async () => {
  const p = await page(360)
  await p.goto(base + '/')
  await p.getByRole('button', { name: 'Menu', exact: true }).click()
  await p.getByRole('button', { name: 'Close' }).click()
  await p.getByRole('dialog').waitFor({ state: 'detached' })
  await p.getByRole('button', { name: 'Menu', exact: true }).click()
  await p.getByRole('dialog').waitFor()
  await p.mouse.click(10, 400) // backdrop, left of the 352px panel
  await p.getByRole('dialog').waitFor({ state: 'detached' })
  await p.close()
})

await test('Menu link navigates and closes the drawer', async () => {
  const p = await page(360)
  await p.goto(base + '/')
  await p.getByRole('button', { name: 'Menu', exact: true }).click()
  await p.getByRole('dialog').getByRole('link', { name: /Celebration Cakes/ }).click()
  await p.waitForURL('**/menu/cakes')
  await p.getByRole('dialog').waitFor({ state: 'detached' })
  await waitH1(p, 'Celebration Cakes')
  await p.close()
})

await test('focus stays trapped in the open drawer (30 × Tab)', async () => {
  const p = await page(1280)
  await p.goto(base + '/')
  await p.getByRole('button', { name: 'Menu', exact: true }).click()
  await p.getByRole('dialog').waitFor()
  for (let i = 0; i < 30; i++) {
    await p.keyboard.press(i % 7 === 6 ? 'Shift+Tab' : 'Tab')
    const inside = await p.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))
    assert(inside, `focus escaped after ${i + 1} presses`)
  }
  await p.close()
})

await test('switching Menu → Search inside the drawer moves focus into the new panel', async () => {
  const p = await page(1280)
  await p.goto(base + '/')
  await p.getByRole('button', { name: 'Menu', exact: true }).click()
  await p.getByRole('dialog').getByRole('button', { name: 'Search the menu' }).click()
  await p.getByRole('dialog', { name: 'Search' }).waitFor()
  await p.keyboard.press('Tab')
  const inside = await p.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))
  assert(inside, 'focus left the dialog after switching panels')
  await p.close()
})

await test('category tabs route and mark the active tab', async () => {
  const p = await page(1280)
  await p.goto(base + '/menu/cakes')
  for (const [tab, title] of [['Cookies', 'The Cookie Jar'], ['Macarons', 'The Macaron Bar'], ['Pastries', 'Cream Pastries'], ['Cakes', 'Celebration Cakes']]) {
    await p.getByRole('navigation', { name: 'Menu categories' }).getByRole('link', { name: tab }).click()
    await p.waitForURL(`**/menu/${tab.toLowerCase()}`)
    await waitH1(p, title)
    const current = await p.getByRole('link', { name: tab, exact: true }).first().getAttribute('aria-current')
    assert(current === 'page', `${tab} tab not aria-current`)
  }
  await p.close()
})

await test('every footer link routes to the right page', async () => {
  const p = await page(1280)
  const expected = { 'Celebration Cakes': 'Celebration Cakes', 'Fresh-baked Cookies': 'The Cookie Jar', 'French Macarons': 'The Macaron Bar', 'Cream Pastries': 'Cream Pastries' }
  for (const [label, title] of Object.entries(expected)) {
    await p.goto(base + '/')
    await p.locator('footer').getByRole('link', { name: label }).click()
    await p.waitForURL('**/menu/**')
    await waitH1(p, title)
    assert((await p.evaluate(() => window.scrollY)) === 0, `${label}: not scrolled to top`)
  }
  await p.close()
})

await test('wordmark returns home', async () => {
  const p = await page(1280)
  await p.goto(base + '/menu/cookies')
  await p.getByRole('link', { name: /home$/ }).first().click()
  await p.waitForURL(base + '/')
  await p.close()
})

await test('unknown category and unknown path show the 404 page', async () => {
  const p = await page(1280)
  for (const path of ['/menu/bogus', '/nope/at/all']) {
    await p.goto(base + path)
    assert((await h1(p)) === 'This tray is empty.', `${path} → ${await h1(p)}`)
  }
  await p.close()
})

await test('cart badge shows total quantity and survives reload', async () => {
  const p = await page(1280)
  await p.goto(base + '/')
  await p.evaluate(() => localStorage.setItem('foodbekary-cart', JSON.stringify({ state: { lines: [{ productId: 'a', qty: 1 }, { productId: 'b', qty: 3 }] }, version: 1 })))
  await p.reload()
  assert((await p.getByTestId('cart-count').innerText()) === '4', 'badge not 4')
  await p.getByRole('button', { name: 'Cart, 4 items' }).click()
  await p.getByRole('dialog', { name: 'Your Order' }).waitFor()
  await p.close()
})

await test('Ctrl+K and footer buttons open their panels', async () => {
  const p = await page(1280)
  await p.goto(base + '/', { waitUntil: 'networkidle' })
  await p.getByTestId('cart-count').waitFor()
  await p.keyboard.press('Control+k')
  await p.getByRole('dialog', { name: 'Search' }).waitFor()
  await p.keyboard.press('Escape')
  await p.locator('footer').getByRole('button', { name: /Saved favourites/ }).click()
  await p.getByRole('dialog', { name: 'Saved Favourites' }).waitFor()
  await p.close()
})

await test('newsletter validates then confirms', async () => {
  const p = await page(1280)
  await p.goto(base + '/')
  const input = p.getByLabel('Email address')
  await input.fill('not-an-email')
  await p.getByRole('button', { name: 'Subscribe' }).click()
  await p.getByText('Please enter a valid email address.').waitFor()
  assert((await input.getAttribute('aria-invalid')) === 'true', 'aria-invalid not set')
  await input.fill('me@example.com')
  await p.getByRole('button', { name: 'Subscribe' }).click()
  await p.getByRole('status').waitFor()
  await p.close()
})

await test('header stays pinned at top while scrolling', async () => {
  const p = await page(1280)
  await p.goto(base + '/')
  await p.mouse.wheel(0, 1500)
  await p.waitForTimeout(400)
  const top = await p.locator('header').first().evaluate((el) => el.getBoundingClientRect().top)
  assert(top === 0, `header top = ${top}`)
  await p.close()
})

await test('no layout shift on load or when opening the drawer (CLS = 0)', async () => {
  for (const [path, width] of [['/', 360], ['/', 1440], ['/menu/cakes', 360], ['/menu/cakes', 1440], ['/menu/x', 768]]) {
    const p = await page(width)
    await p.addInitScript(() => {
      window.__cls = 0
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value })).observe({ type: 'layout-shift', buffered: true })
    })
    await p.goto(base + path, { waitUntil: 'networkidle' })
    await p.getByRole('button', { name: /^Cart/ }).click()
    await p.getByRole('dialog').waitFor()
    await p.waitForTimeout(600)
    const cls = await p.evaluate(() => window.__cls)
    assert(cls < 0.01, `${path} @${width}: CLS ${cls}`)
    await p.close()
  }
})

await browser.close()
console.log(results.join('\n'))
console.log(errors.length ? `\nConsole problems:\n${[...new Set(errors)].join('\n')}` : '\nConsole: clean')
process.exit(results.some((r) => r.startsWith('FAIL')) || errors.length ? 1 : 0)
