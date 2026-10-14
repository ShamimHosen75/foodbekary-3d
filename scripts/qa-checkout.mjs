// Phase 5 browser QA: cart drawer, checkout, order flow. Usage: node scripts/qa-checkout.mjs [baseUrl]
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
const results = []
const errors = []
const assert = (c, m) => { if (!c) throw new Error(m) }

async function open(path, { width = 1280, cart } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  // Seed once per tab; skipped on pages that can't use storage (e.g. the wa.me popup).
  if (cart) await ctx.addInitScript((lines) => { try { if (!sessionStorage.getItem('__seeded')) { localStorage.setItem('foodbekary-cart', JSON.stringify({ state: { lines }, version: 1 })); sessionStorage.setItem('__seeded', '1') } } catch { /* opaque origin */ } }, cart)
  const p = await ctx.newPage()
  p.on('console', (m) => ['error', 'warning'].includes(m.type()) && !m.text().includes('wa.me') && errors.push(`${m.type()}: ${m.text()}`))
  p.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  await p.goto(base + path, { waitUntil: 'networkidle' })
  await p.getByTestId('cart-count').waitFor()
  return p
}
async function test(name, fn) {
  try { await fn(); results.push(`PASS  ${name}`) } catch (e) { results.push(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`) }
}
const badge = (p) => p.getByTestId('cart-count').innerText()
const openCart = async (p) => { await p.locator('header').getByRole('button', { name: /^Cart/ }).click(); return p.getByRole('dialog', { name: 'Your Order' }) }
const fill = async (p, v) => {
  if (v.name !== undefined) await p.getByLabel('Full name').fill(v.name)
  if (v.phone !== undefined) await p.getByLabel('Mobile number').fill(v.phone)
  if (v.zone) await p.getByRole('radio', { name: new RegExp(v.zone) }).check()
  if (v.address !== undefined) await p.getByLabel('Full address').fill(v.address)
}
const good = { name: 'Nusrat Jahan', phone: '01712345678', zone: 'Inside Dhaka', address: 'House 12, Road 5, Dhanmondi, Dhaka' }

await test('empty cart: drawer and /checkout show an empty state', async () => {
  const p = await open('/')
  const d = await openCart(p)
  await d.getByText('Your basket is empty').waitFor()
  await p.goto(base + '/checkout', { waitUntil: 'networkidle' })
  await p.getByRole('heading', { name: 'Your basket is empty' }).waitFor()
  await p.close()
})

await test('price math: card + Quick View adds → correct lines, sale prices, subtotal, badge', async () => {
  const p = await open('/menu/cookies')
  await p.getByRole('button', { name: 'Add Nutella Stuffed Cookie to cart' }).click() // 180
  await p.goto(base + '/menu/cakes', { waitUntil: 'networkidle' })
  await p.getByRole('button', { name: 'Quick view: Dark Truffle Drip Cake' }).click()
  const inc = p.getByRole('dialog').getByRole('button', { name: 'Increase quantity' })
  await inc.click(); await inc.click()
  await p.getByRole('button', { name: 'Add 3 to Cart • ৳ 6,900' }).click() // sale 2300 × 3
  const d = p.getByRole('dialog', { name: 'Your Order' })
  await d.waitFor()
  assert((await d.getByTestId('cart-line').count()) === 2, 'lines != 2')
  assert((await d.getByTestId('drawer-subtotal').innerText()) === '৳ 7,080', await d.getByTestId('drawer-subtotal').innerText())
  assert((await badge(p)) === '4', `badge ${await badge(p)}`)
  await p.close()
})

await test('drawer quantity −/+ updates line, subtotal and badge; limits enforced', async () => {
  const p = await open('/', { cart: [{ productId: 'lotus-biscoff-cake', qty: 1 }, { productId: 'raspberry-macaron', qty: 1 }] })
  const d = await openCart(p)
  const lotus = d.getByRole('group', { name: 'Quantity for Lotus Biscoff Cake' })
  assert(await lotus.getByRole('button', { name: 'Decrease quantity' }).isDisabled(), '− enabled at 1')
  await lotus.getByRole('button', { name: 'Increase quantity' }).click()
  assert(await lotus.getByRole('button', { name: 'Increase quantity' }).isDisabled(), '+ enabled at stock 2')
  assert((await d.getByTestId('drawer-subtotal').innerText()) === '৳ 5,490', await d.getByTestId('drawer-subtotal').innerText()) // 2700×2 + 90
  assert((await badge(p)) === '3', `badge ${await badge(p)}`)
  await d.getByRole('button', { name: 'Remove Raspberry Macaron from cart' }).click()
  await d.getByRole('button', { name: 'Remove Lotus Biscoff Cake from cart' }).click()
  await d.getByText('Your basket is empty').waitFor()
  assert((await badge(p)) === '0', 'badge not 0')
  await p.close()
})

await test('cart survives a page refresh', async () => {
  const p = await open('/menu/pastries')
  await p.getByRole('button', { name: 'Add Red Velvet Slice to cart' }).click()
  await p.getByRole('button', { name: 'Add Red Velvet Slice to cart' }).click()
  await p.reload({ waitUntil: 'networkidle' })
  assert((await badge(p)) === '2', 'badge lost')
  const d = await openCart(p)
  assert((await d.getByTestId('drawer-subtotal').innerText()) === '৳ 460', 'subtotal lost')
  await p.close()
})

await test('stale cart: over-stock reduced with note; per-order cap note; sold-out blocks checkout', async () => {
  const p = await open('/', { cart: [{ productId: 'lotus-biscoff-cake', qty: 5 }, { productId: 'classic-chocolate-chunk', qty: 25 }, { productId: 'mango-cream-cake', qty: 1 }] })
  const d = await openCart(p)
  await d.getByText('Only 2 left today').waitFor()
  await d.getByText('Maximum 20 per order').waitFor()
  await d.getByText('Sold out today — remove to continue.').waitFor()
  await d.getByText('Remove sold-out items to continue.').waitFor()
  assert((await d.getByRole('link', { name: /Checkout/ }).count()) === 0, 'checkout link shown while blocked')
  await d.getByRole('button', { name: 'Remove Mango Cream Cake from cart' }).click()
  assert((await d.getByTestId('drawer-subtotal').innerText()) === '৳ 7,800', await d.getByTestId('drawer-subtotal').innerText()) // 2700×2 + 120×20
  await d.getByRole('link', { name: 'Checkout · ৳ 7,800' }).click()
  await p.waitForURL('**/checkout')
  await p.close()
})

await test('validation: empty submit lists errors, marks fields invalid and focuses the first', async () => {
  const p = await open('/checkout', { cart: [{ productId: 'pistachio-macaron', qty: 2 }] })
  await p.getByRole('button', { name: /Place order/ }).click()
  await p.getByText('Please fix 4 fields below').waitFor()
  for (const t of ['Please enter your name.', 'Please enter your mobile number.', 'Choose where we are delivering.', 'Please enter your delivery address.']) await p.getByText(t).waitFor()
  assert((await p.getByLabel('Full name').getAttribute('aria-invalid')) === 'true', 'aria-invalid missing')
  assert(await p.getByLabel('Full name').evaluate((el) => el === document.activeElement), 'name not focused')
  await p.close()
})

await test('validation: BD phone format, live clearing as fields are fixed', async () => {
  const p = await open('/checkout', { cart: [{ productId: 'pistachio-macaron', qty: 1 }] })
  await fill(p, { ...good, phone: '12345' })
  await p.getByRole('button', { name: /Place order/ }).click()
  await p.getByText('Enter a valid Bangladeshi mobile number, e.g. 01712345678.').waitFor()
  await p.getByLabel('Mobile number').fill('+880 1712-345678')
  await p.getByText('Enter a valid Bangladeshi').waitFor({ state: 'detached' })
  assert((await p.getByRole('alert').count()) === 0, 'error summary still shown')
  await p.close()
})

await test('delivery zone drives the fee and total', async () => {
  const p = await open('/checkout', { cart: [{ productId: 'tiramisu-cup', qty: 2 }] }) // 520
  assert((await p.getByTestId('delivery').innerText()) === 'Choose area', 'fee shown before choice')
  await p.getByRole('radio', { name: /Inside Dhaka/ }).check()
  assert((await p.getByTestId('total').innerText()) === '৳ 580', await p.getByTestId('total').innerText())
  await p.getByRole('radio', { name: /Outside Dhaka/ }).check()
  assert((await p.getByTestId('total').innerText()) === '৳ 640', await p.getByTestId('total').innerText())
  await p.getByRole('button', { name: 'Place order · ৳ 640' }).waitFor()
  await p.close()
})

await test('double-submit: rapid double click creates exactly one order; confirmation + receipt', async () => {
  const p = await open('/checkout', { cart: [{ productId: 'nutella-stuffed-cookie', qty: 2 }, { productId: 'mango-mousse-slice', qty: 1 }] })
  await fill(p, { ...good, zone: 'Outside Dhaka' })
  await p.getByRole('button', { name: /Place order/ }).dblclick()
  await p.getByRole('button', { name: 'Placing order…' }).waitFor()
  await p.waitForURL('**/order/FB-*')
  const orders = await p.evaluate(() => JSON.parse(localStorage.getItem('foodbekary-orders')).state.orders)
  assert(orders.length === 1, `orders: ${orders.length}`)
  assert(orders[0].total === 690 && orders[0].subtotal === 570 && orders[0].deliveryFee === 120, JSON.stringify(orders[0]))
  await p.getByRole('heading', { name: 'Thank you, Nusrat!' }).waitFor()
  await p.getByText(orders[0].id).first().waitFor()
  assert((await p.getByTestId('total').innerText()) === '৳ 690', 'confirmation total')
  assert((await badge(p)) === '0', 'cart not cleared')
  await p.goBack()
  assert(!p.url().endsWith('/checkout'), 'Back returned to checkout')
  await p.close()
})

await test('My Orders panel lists the receipt; unknown order id shows not-found', async () => {
  const p = await open('/checkout', { cart: [{ productId: 'red-velvet-slice', qty: 1 }] })
  await fill(p, good)
  await p.getByRole('button', { name: /Place order/ }).click()
  await p.waitForURL('**/order/FB-*')
  const id = p.url().split('/order/')[1]
  await p.goto(base + '/', { waitUntil: 'networkidle' })
  await p.locator('header').getByRole('button', { name: 'My orders' }).click()
  await p.getByRole('dialog', { name: 'My Orders' }).getByRole('link', { name: id }).click()
  await p.waitForURL(`**/order/${id}`)
  await p.goto(base + '/order/FB-000000-NOPE', { waitUntil: 'networkidle' })
  await p.getByRole('heading', { name: 'We can’t find that receipt.' }).waitFor()
  await p.close()
})

await test('Order via WhatsApp opens wa.me with the full summary, then confirms', async () => {
  const p = await open('/checkout', { cart: [{ productId: 'macaron-gift-box', qty: 1 }] })
  await fill(p, { ...good, zone: 'Inside Dhaka' })
  await p.getByLabel(/Order notes/).fill('Write “Happy Birthday Ammu”')
  // The popup can't load wa.me here (no network), so read the URL it requested.
  const [req] = await Promise.all([
    p.context().waitForEvent('request', (r) => r.url().startsWith('https://wa.me/')),
    p.getByRole('button', { name: '💬 Order via WhatsApp' }).click(),
  ])
  const url = req.url()
  assert(url.startsWith('https://wa.me/'), url)
  const text = decodeURIComponent(url.split('text=')[1] ?? '')
  for (const s of ['1 × Macaron Gift Box (6) — ৳ 520', 'Delivery (Inside Dhaka): ৳ 60', 'Total: ৳ 580', 'Phone: 01712345678', 'Notes: Write “Happy Birthday Ammu”']) assert(text.includes(s), `missing "${s}"`)
  await p.waitForURL('**/order/FB-*')
  await p.getByRole('link', { name: /Open WhatsApp again/ }).waitFor()
  await p.close()
})

await test('checkout draft survives navigating away and back', async () => {
  const p = await open('/checkout', { cart: [{ productId: 'black-forest-slice', qty: 1 }] })
  await p.getByLabel('Full name').fill('Farhana Rahman')
  await p.goto(base + '/menu/cakes', { waitUntil: 'networkidle' })
  await p.goto(base + '/checkout', { waitUntil: 'networkidle' })
  assert((await p.getByLabel('Full name').inputValue()) === 'Farhana Rahman', 'draft lost')
  await p.close()
})

await test('mobile 360: checkout fits, buttons reachable, no horizontal scroll', async () => {
  const p = await open('/checkout', { width: 360, cart: [{ productId: 'pistachio-macaron', qty: 3 }] })
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  assert(overflow <= 0, `overflow ${overflow}`)
  await p.getByRole('button', { name: /Place order/ }).scrollIntoViewIfNeeded()
  await p.screenshot({ path: 'qa-output/p5-checkout-360.png', fullPage: true })
  await p.close()
})

await browser.close()
console.log(results.join('\n'))
console.log(errors.length ? `\nConsole problems:\n${[...new Set(errors)].join('\n')}` : '\nConsole: clean')
process.exit(results.some((r) => r.startsWith('FAIL')) || errors.length ? 1 : 0)
