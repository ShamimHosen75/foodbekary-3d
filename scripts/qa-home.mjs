// Phase 3 browser QA: home page sections. Usage: node scripts/qa-home.mjs [baseUrl]
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
const results = []
const errors = []
const assert = (c, m) => { if (!c) throw new Error(m) }

async function page(width = 1280, height = 720, opts = {}) {
  const p = await browser.newPage({ viewport: { width, height }, ...opts })
  p.on('console', (m) => ['error', 'warning'].includes(m.type()) && errors.push(`${m.type()}: ${m.text()}`))
  p.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  await p.goto(base + '/', { waitUntil: 'networkidle' })
  return p
}
async function test(name, fn) {
  try { await fn(); results.push(`PASS  ${name}`) } catch (e) { results.push(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`) }
}
const heroScrollTo = (p, f) => p.evaluate((f) => {
  const s = document.querySelector('section[aria-label="Our story"]')
  window.scrollTo(0, s.offsetTop + f * (s.offsetHeight - innerHeight))
}, f)
const activeLabel = (p) => p.locator('nav[aria-label="Story scenes"] [aria-current="step"]').getAttribute('aria-label')

await test('home has exactly one h1 and sections in reference order', async () => {
  const p = await page()
  assert((await p.locator('h1').count()) === 1, 'h1 count != 1')
  const order = await p.locator('main > section').evaluateAll((s) => s.map((x) => x.getAttribute('aria-label') ?? x.getAttribute('aria-labelledby')))
  assert(JSON.stringify(order) === JSON.stringify(['Our story', 'showcase-title', 'reviews-title']), `order: ${order}`)
  await p.close()
})

await test('scrolling advances scenes 1→2→3 and back', async () => {
  const p = await page()
  const seen = []
  for (const f of [0.05, 0.4, 0.75, 0.4, 0.05]) {
    await heroScrollTo(p, f)
    await p.waitForTimeout(700)
    seen.push((await activeLabel(p)).split(':')[0])
  }
  assert(seen.join() === 'Scene 1,Scene 2,Scene 3,Scene 2,Scene 1', seen.join())
  await p.close()
})

await test('copy swaps with the scene (title + counter)', async () => {
  const p = await page()
  await heroScrollTo(p, 0.4)
  await p.getByRole('heading', { name: 'Butter, flour, patience.' }).waitFor({ timeout: 3000 })
  await p.getByText('02 / 03').waitFor()
  await p.close()
})

await test('rail dot jumps to its scene; CTAs only on the last scene', async () => {
  const p = await page()
  assert((await p.getByRole('link', { name: 'Explore the menu' }).count()) === 0, 'CTA visible on scene 1')
  await p.getByRole('button', { name: 'Scene 3: The Window Seat' }).click()
  await p.waitForTimeout(1500)
  assert((await activeLabel(p)) === 'Scene 3: The Window Seat', `active: ${await activeLabel(p)}`)
  await p.getByRole('link', { name: 'Explore the menu' }).click()
  await p.waitForURL('**/menu/cakes')
  await p.close()
})

await test('"Order ahead" opens WhatsApp in a new tab with a prefilled message', async () => {
  const p = await page()
  await heroScrollTo(p, 0.75)
  const a = p.getByRole('link', { name: 'Order ahead' })
  await a.waitFor()
  const href = await a.getAttribute('href')
  assert(href.startsWith('https://wa.me/') && href.includes('text='), href)
  assert((await a.getAttribute('target')) === '_blank', 'not _blank')
  await p.close()
})

await test('every category card (whole card) links to its category', async () => {
  const p = await page()
  for (const [name, title] of [['Cakes', 'Celebration Cakes'], ['Cookies', 'The Cookie Jar'], ['Macarons', 'The Macaron Bar'], ['Pastries', 'Cream Pastries']]) {
    await p.goto(base + '/', { waitUntil: 'networkidle' })
    const card = p.locator('article', { has: p.getByRole('heading', { name, exact: true }) })
    await card.scrollIntoViewIfNeeded()
    // Click the card body (description area), not the CTA — the stretched link should catch it.
    const box = await card.boundingBox()
    await p.mouse.click(box.x + 30, box.y + box.height * 0.7)
    await p.locator('h1', { hasText: title }).waitFor({ timeout: 4000 })
  }
  await p.close()
})

await test('category card hover lifts the card and recolours title + CTA', async () => {
  const p = await page()
  const card = p.locator('article').first()
  await card.scrollIntoViewIfNeeded()
  await p.waitForTimeout(900)
  const before = await card.evaluate((el) => ({ t: getComputedStyle(el).translate, h: getComputedStyle(el.querySelector('h3')).color }))
  await card.hover()
  await p.waitForTimeout(500)
  const after = await card.evaluate((el) => ({ t: getComputedStyle(el).translate, h: getComputedStyle(el.querySelector('h3')).color }))
  assert(before.t !== after.t, 'no lift')
  assert(before.h !== after.h, 'title colour unchanged')
  await p.close()
})

await test('all reveal-animated content ends fully visible after scrolling', async () => {
  const p = await page(1280, 720)
  const total = await p.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < total; y += 400) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(120) }
  await p.waitForTimeout(900)
  const hidden = await p.evaluate(() => [...document.querySelectorAll('#main article, #main figure, #main section:not([aria-label="Our story"]) h2')].filter((e) => {
    let n = e; while (n) { if (Number(getComputedStyle(n).opacity) < 0.99) return true; n = n.parentElement } return false
  }).map((e) => e.textContent.slice(0, 30)))
  assert(hidden.length === 0, `still hidden: ${hidden.join(' | ')}`)
  await p.close()
})

await test('testimonials: 3 reviews with accessible star ratings', async () => {
  const p = await page()
  const figs = p.locator('section[aria-labelledby="reviews-title"] figure')
  assert((await figs.count()) === 3, 'not 3')
  assert((await p.getByRole('img', { name: '5 out of 5 stars' }).count()) === 3, 'stars label missing')
  await p.close()
})

await test('reduced motion: no zoom on hero photos, copy still swaps', async () => {
  const p = await page(1280, 720, { reducedMotion: 'reduce' })
  await heroScrollTo(p, 0.4)
  await p.waitForTimeout(700)
  const transforms = await p.locator('section[aria-label="Our story"] img').evaluateAll((imgs) => imgs.map((i) => getComputedStyle(i).transform))
  assert(transforms.every((t) => t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)'), transforms.join(' '))
  await p.getByRole('heading', { name: 'Butter, flour, patience.' }).waitFor({ timeout: 3000 })
  await p.close()
})

await test('keyboard reaches the scene rail', async () => {
  const p = await page()
  let found = false
  for (let i = 0; i < 25 && !found; i++) {
    await p.keyboard.press('Tab')
    found = await p.evaluate(() => document.activeElement?.getAttribute('aria-label')?.startsWith('Scene 1'))
  }
  assert(found, 'scene rail not reachable by Tab')
  await p.close()
})

await test('no layout shift on load at 360 and 1440 (CLS < 0.01)', async () => {
  for (const w of [360, 1440]) {
    const p = await browser.newPage({ viewport: { width: w, height: 800 } })
    await p.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value })).observe({ type: 'layout-shift', buffered: true }) })
    await p.goto(base + '/', { waitUntil: 'networkidle' })
    await p.waitForTimeout(800)
    const cls = await p.evaluate(() => window.__cls)
    assert(cls < 0.01, `@${w}: CLS ${cls}`)
    await p.close()
  }
})

await test('hero scroll frame pacing (software-rendered headless; indicative)', async () => {
  const p = await page(1280, 720)
  const stats = await p.evaluate(async () => {
    const s = document.querySelector('section[aria-label="Our story"]')
    const end = s.offsetTop + s.offsetHeight - innerHeight
    const gaps = []
    let last = performance.now()
    await new Promise((done) => {
      let y = 0
      const step = (t) => { gaps.push(t - last); last = t; y += 24; window.scrollTo(0, y); if (y < end) requestAnimationFrame(step); else done() }
      requestAnimationFrame(step)
    })
    gaps.sort((a, b) => a - b)
    return { frames: gaps.length, median: gaps[gaps.length >> 1].toFixed(1), p95: gaps[Math.floor(gaps.length * 0.95)].toFixed(1) }
  })
  results.push(`      frames=${stats.frames} median=${stats.median}ms p95=${stats.p95}ms`)
  assert(Number(stats.median) < 20, `median frame ${stats.median}ms`)
  await p.close()
})

await browser.close()
console.log(results.join('\n'))
console.log(errors.length ? `\nConsole problems:\n${[...new Set(errors)].join('\n')}` : '\nConsole: clean')
process.exit(results.some((r) => r.startsWith('FAIL')) || errors.length ? 1 : 0)
