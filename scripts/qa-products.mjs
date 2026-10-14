// Phase 4 browser QA: catalogue, filters, quick view, product page. Usage: node scripts/qa-products.mjs [baseUrl]
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
const results = []
const errors = []
const assert = (c, m) => { if (!c) throw new Error(m) }

async function open(path, width = 1280) {
  const p = await browser.newPage({ viewport: { width, height: 900 } })
  p.on('console', (m) => ['error', 'warning'].includes(m.type()) && errors.push(`${m.type()}: ${m.text()}`))
  p.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  await p.goto(base + path, { waitUntil: 'networkidle' })
  await p.getByTestId('cart-count').waitFor()
  return p
}
async function test(name, fn) {
  try { await fn(); results.push(`PASS  ${name}`) } catch (e) { results.push(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`) }
}
const cards = (p) => p.getByTestId('product-grid').locator('article h3')
const names = async (p) => { await p.waitForTimeout(450); return cards(p).allInnerTexts() }
const chip = (p, name) => p.getByRole('group', { name: 'Filter products' }).getByRole('button', { name, exact: true })
const badge = (p) => p.getByTestId('cart-count').innerText()
const cols = (p) => p.getByTestId('product-grid').evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(' ').length)

await test('chip + search combine (AND); no-match shows empty state; Clear resets', async () => {
  const p = await open('/menu/cakes')
  assert((await names(p)).length === 8, 'expected 8 cakes')
  await chip(p, 'Chocolate').click()
  assert((await names(p)).join() === 'Chocolate Celebration Cake,Dark Truffle Drip Cake', (await names(p)).join())
  await p.getByLabel('Search cakes').fill('truffle')
  assert((await names(p)).join() === 'Dark Truffle Drip Cake', (await names(p)).join())
  await chip(p, 'Berries & Fruit').click()
  await p.getByText('Nothing on this tray matches “truffle”.').waitFor()
  await p.getByRole('button', { name: 'Clear filters' }).click()
  assert((await names(p)).length === 8, 'clear did not reset')
  assert((await p.getByLabel('Search cakes').inputValue()) === '', 'search not cleared')
  await p.close()
})

await test('filter state lives in the URL: deep link, Back button, bad values ignored', async () => {
  const p = await open('/menu/cakes?f=chocolate&q=truffle')
  assert((await names(p)).join() === 'Dark Truffle Drip Cake', 'deep link not applied')
  assert((await chip(p, 'Chocolate').getAttribute('aria-pressed')) === 'true', 'chip not active')
  await p.goto(base + '/menu/cakes', { waitUntil: 'networkidle' })
  await chip(p, 'Bestsellers').click()
  await p.waitForURL('**f=bestsellers')
  await p.goBack()
  await p.waitForURL(base + '/menu/cakes')
  assert((await names(p)).length === 8, 'Back did not restore All')
  await p.goto(base + '/menu/cakes?f=bogus', { waitUntil: 'networkidle' })
  assert((await names(p)).length === 8 && (await chip(p, 'All Cakes (8)').getAttribute('aria-pressed')) === 'true', 'bogus filter not ignored')
  await p.close()
})

await test('grid uses 3 columns normally and 2 wide columns for ≤2 results', async () => {
  const p = await open('/menu/cakes')
  assert((await cols(p)) === 3, `cols ${await cols(p)}`)
  await chip(p, 'Chocolate').click()
  await p.waitForTimeout(400)
  assert((await cols(p)) === 2, `filtered cols ${await cols(p)}`)
  await p.close()
})

await test('every category page lists its products (8/6/6/6) with working chips', async () => {
  const p = await open('/menu/cookies')
  for (const [slug, n, c, cn] of [['cakes', 8, 'Bestsellers', 3], ['cookies', 6, 'Stuffed', 2], ['macarons', 6, 'Gift Sets', 2], ['pastries', 6, 'Red Velvet', 1]]) {
    await p.goto(`${base}/menu/${slug}`, { waitUntil: 'networkidle' })
    assert((await names(p)).length === n, `${slug}: ${(await names(p)).length}`)
    await chip(p, c).click()
    assert((await names(p)).length === cn, `${slug}/${c}: ${(await names(p)).length}`)
  }
  await p.close()
})

await test('sold-out product: disabled card button, Quick View + product page show sold-out note', async () => {
  const p = await open('/menu/cakes')
  const btn = p.getByRole('button', { name: 'Sold out: Mango Cream Cake' })
  assert(await btn.isDisabled(), 'card button enabled')
  await p.getByRole('button', { name: 'Quick view: Mango Cream Cake' }).click()
  await p.getByRole('dialog').getByText('Sold out for today').waitFor()
  assert((await p.getByRole('dialog').getByRole('button', { name: /Add \d+ to Cart/ }).count()) === 0, 'add button in sold-out modal')
  await p.goto(base + '/product/mango-cream-cake', { waitUntil: 'networkidle' })
  await p.getByText('Sold out for today').waitFor()
  assert((await badge(p)) === '0', 'cart changed')
  await p.close()
})

await test('Quick View: qty updates the button total; adding closes modal, opens cart, toasts, updates badge', async () => {
  const p = await open('/menu/cakes')
  await p.getByRole('button', { name: 'Quick view: Berry Chantilly Cake' }).click()
  const dlg = p.getByRole('dialog', { name: 'Berry Chantilly Cake' })
  await dlg.getByRole('button', { name: 'Increase quantity' }).click()
  await dlg.getByRole('button', { name: 'Add 2 to Cart • ৳ 4,400' }).click()
  await p.getByRole('dialog', { name: 'Your Order' }).waitFor()
  await p.getByText('“Berry Chantilly Cake” added to your cart').waitFor()
  assert((await badge(p)) === '2', `badge ${await badge(p)}`)
  await p.close()
})

await test('stock cap: Lotus (2 left) — stepper stops at 2, then card add refuses with a toast', async () => {
  const p = await open('/product/lotus-biscoff-cake')
  const inc = p.getByRole('button', { name: 'Increase quantity' })
  await inc.click()
  assert(await inc.isDisabled(), '+ still enabled at stock limit')
  await p.getByRole('button', { name: /Add 2 to Cart/ }).click()
  await p.keyboard.press('Escape')
  await p.getByText('You have all 2 of today’s stock in your cart.').waitFor()
  await p.goto(base + '/menu/cakes', { waitUntil: 'networkidle' })
  await p.getByRole('button', { name: 'Add to Cart: Lotus Biscoff Cake' }).click()
  await p.getByText('maximum of “Lotus Biscoff Cake”').waitFor()
  assert((await badge(p)) === '2', `badge ${await badge(p)}`)
  await p.close()
})

await test('card Add to Cart adds one and confirms with a toast', async () => {
  const p = await open('/menu/cookies')
  await p.getByRole('button', { name: 'Add to Cart: Nutella Stuffed Cookie' }).click()
  await p.getByRole('button', { name: 'Add to Cart: Nutella Stuffed Cookie' }).click()
  await p.getByText('“Nutella Stuffed Cookie” added to your cart').first().waitFor()
  assert((await badge(p)) === '2', `badge ${await badge(p)}`)
  await p.close()
})

await test('unknown product slug shows the 404 page', async () => {
  const p = await open('/product/does-not-exist')
  await p.locator('h1', { hasText: 'This tray is empty.' }).waitFor()
  await p.close()
})

await test('favourites: toggle, persist across reload, listed in panel, removable', async () => {
  const p = await open('/menu/macarons')
  const heart = p.getByRole('button', { name: 'Save Pistachio Macaron to favourites' })
  await heart.click()
  await p.getByRole('button', { name: 'Remove Pistachio Macaron from favourites' }).first().waitFor()
  await p.reload({ waitUntil: 'networkidle' })
  assert((await p.getByRole('button', { name: 'Remove Pistachio Macaron from favourites' }).first().getAttribute('aria-pressed')) === 'true', 'not persisted')
  await p.locator('header').getByRole('button', { name: 'Saved favourites' }).click()
  const panel = p.getByRole('dialog', { name: 'Saved Favourites' })
  await panel.getByRole('link', { name: 'Pistachio Macaron' }).waitFor()
  await panel.getByRole('button', { name: 'Remove Pistachio Macaron from favourites' }).click()
  await panel.getByText('Tap the heart').waitFor()
  await p.close()
})

await test('menu search (Ctrl+K): live results, Enter opens the first product', async () => {
  const p = await open('/')
  await p.keyboard.press('Control+k')
  const panel = p.getByRole('dialog', { name: 'Search' })
  await panel.getByLabel('Search the whole menu').fill('mango')
  await panel.getByText('2 results').waitFor()
  await p.keyboard.press('Enter')
  await p.waitForURL('**/product/mango-cream-cake')
  await p.getByRole('dialog').waitFor({ state: 'detached' })
  await p.close()
})

await test('product page: breadcrumb, gallery thumbnails, sale price, 3 related (not itself)', async () => {
  const p = await open('/product/dark-truffle-drip-cake')
  await p.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Cakes' }).waitFor()
  await p.getByRole('button', { name: 'Show photo 2' }).click()
  assert((await p.getByRole('img', { name: 'Dark Truffle Drip Cake, photo 2 of 2' }).count()) === 1, 'thumb did not switch')
  assert((await p.locator('main s').first().innerText()).includes('2,600'), 'no strikethrough price')
  const rel = await p.locator('section[aria-labelledby="related-title"] article h3').allInnerTexts()
  assert(rel.length === 3 && !rel.includes('Dark Truffle Drip Cake'), rel.join())
  await p.close()
})

await test('keyboard: Tab to a card’s Quick View, Enter opens, Esc closes and restores focus', async () => {
  const p = await open('/menu/pastries')
  const qv = p.getByRole('button', { name: 'Quick view: Chocolate Fudge Slice' })
  await qv.focus()
  await p.keyboard.press('Enter')
  await p.getByRole('dialog', { name: 'Chocolate Fudge Slice' }).waitFor()
  await p.keyboard.press('Escape')
  await p.getByRole('dialog').waitFor({ state: 'detached' })
  assert(await qv.evaluate((el) => el === document.activeElement), 'focus not restored')
  await p.close()
})

await test('mobile 360: Quick View heart not covered by close button; Add button visible without scrolling', async () => {
  const p = await open('/menu/macarons', 360)
  await p.getByRole('button', { name: 'Quick view: Pistachio Macaron' }).click()
  const dlg = p.getByRole('dialog')
  await dlg.waitFor()
  await p.waitForTimeout(500)
  const close = await dlg.getByRole('button', { name: 'Close' }).boundingBox()
  const heart = await dlg.getByRole('button', { name: /favourites/ }).boundingBox()
  const overlap = !(close.x + close.width < heart.x || heart.x + heart.width < close.x || close.y + close.height < heart.y || heart.y + heart.height < close.y)
  assert(!overlap, 'close overlaps heart')
  const add = await dlg.getByRole('button', { name: /Add 1 to Cart/ }).boundingBox()
  assert(add && add.y + add.height <= 900, `add button at y=${add?.y}`)
  await p.close()
})

await browser.close()
console.log(results.join('\n'))
console.log(errors.length ? `\nConsole problems:\n${[...new Set(errors)].join('\n')}` : '\nConsole: clean')
process.exit(results.some((r) => r.startsWith('FAIL')) || errors.length ? 1 : 0)
