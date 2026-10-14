// Runs Lighthouse (mobile + desktop) against the local preview and prints a score table.
// Usage: node scripts/lighthouse.mjs [baseUrl] [route ...]
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.argv[2] ?? 'http://localhost:4173'
const routes = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/menu/cakes', '/product/dark-truffle-drip-cake', '/checkout']
const chrome = await chromeLauncher.launch({
  chromePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium',
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
})
await mkdir('qa-output/lighthouse', { recursive: true })
const rows = []
for (const formFactor of ['mobile', 'desktop']) {
  for (const route of routes) {
    const config = formFactor === 'desktop'
      ? (await import('lighthouse/core/config/desktop-config.js')).default
      : undefined
    const { lhr } = await lighthouse(base + route, { port: chrome.port, output: 'json', logLevel: 'error' }, config)
    const s = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100)
    const fails = Object.values(lhr.audits)
      .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual')
      .map((a) => `${a.id}(${a.displayValue ?? a.score})`)
    rows.push({ formFactor, route, perf: s('performance'), a11y: s('accessibility'), bp: s('best-practices'), seo: s('seo'),
      lcp: lhr.audits['largest-contentful-paint']?.displayValue, cls: lhr.audits['cumulative-layout-shift']?.displayValue, tbt: lhr.audits['total-blocking-time']?.displayValue, fails })
    await writeFile(`qa-output/lighthouse/${formFactor}${route.replace(/\W+/g, '_') || '_home'}.json`, JSON.stringify(lhr))
  }
}
await chrome.kill()
for (const r of rows) {
  console.log(`${r.formFactor.padEnd(8)} ${r.route.padEnd(34)} P${r.perf} A${r.a11y} BP${r.bp} SEO${r.seo}  LCP ${r.lcp}  CLS ${r.cls}  TBT ${r.tbt}`)
  if (r.fails.length) console.log(`         ↳ ${r.fails.join(', ')}`)
}
process.exit(rows.some((r) => Math.min(r.perf, r.a11y, r.bp, r.seo) < 90) ? 1 : 0)
