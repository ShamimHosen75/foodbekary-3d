// Browser QA: loads each route at 360/768/1024/1440, fails on console errors,
// page errors or horizontal overflow, and saves full-page screenshots.
// Usage: node scripts/qa-screens.mjs [baseUrl] [route ...]
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const base = process.argv[2] ?? 'http://localhost:4173'
const routes = process.argv.slice(3).length ? process.argv.slice(3) : ['/']
const widths = [360, 768, 1024, 1440]
const outDir = 'qa-output'
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium',
})
let failures = 0

for (const route of routes) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    const problems = []
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') problems.push(`console.${m.type()}: ${m.text()}`)
    })
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
    page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()}`))

    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    if (overflow > 0) problems.push(`horizontal overflow: ${overflow}px`)

    const name = `${route === '/' ? 'home' : route.replace(/\W+/g, '-').replace(/^-|-$/g, '')}-${width}`
    await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true })
    console.log(`${problems.length ? 'FAIL' : 'PASS'} ${route} @${width}px${problems.map((p) => `\n   - ${p}`).join('')}`)
    failures += problems.length ? 1 : 0
    await page.close()
  }
}

await browser.close()
process.exit(failures ? 1 : 0)
