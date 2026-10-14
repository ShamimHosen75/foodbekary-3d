// Renders the social share image (1200×630) and app icons from the brand tokens.
// Usage: node scripts/art/brand.mjs   (re-run after changing the brand name/colours)
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const hero = readFileSync('src/assets/hero/scene-shopfront-1600.webp').toString('base64')
const fraunces = readFileSync('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2').toString('base64')
const inter = readFileSync('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2').toString('base64')
const fonts = `@font-face{font-family:F;src:url(data:font/woff2;base64,${fraunces})}@font-face{font-family:I;src:url(data:font/woff2;base64,${inter})}`
const site = readFileSync('src/data/site.ts', 'utf8')
const lead = site.match(/lead: '([^']+)'/)[1]
const accent = site.match(/accent: '([^']+)'/)[1]
const tagline = site.match(/tagline: '([^']+)'/)[1]

const og = `<style>${fonts}body{margin:0}</style>
<div style="width:1200px;height:630px;position:relative;overflow:hidden;background:#2c231a">
  <img src="data:image/webp;base64,${hero}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,#f2eee4 0%,rgba(242,238,228,.92) 38%,rgba(242,238,228,0) 72%)"></div>
  <div style="position:absolute;left:80px;top:50%;transform:translateY(-50%)">
    <div style="font:600 22px/1 I;letter-spacing:.2em;text-transform:uppercase;color:#a84e2c">${tagline}</div>
    <div style="font:700 96px/1.05 F;color:#2c231a;margin-top:22px">${lead}<span style="color:#b4532f">${accent}</span></div>
    <div style="font:500 28px/1.4 I;color:#6b5e54;margin-top:22px;max-width:520px">Cakes · Cookies · Macarons · Pastries<br>Cash on Delivery across Dhaka</div>
  </div>
</div>`
const icon = (size, pad) => `<style>${fonts}body{margin:0}</style>
<div style="width:${size}px;height:${size}px;background:#2c231a;display:grid;place-items:center;border-radius:${pad ? 0 : size * 0.22}px">
  <span style="font:700 ${size * 0.56}px/1 F;color:#e08d6e;transform:translateY(-3%)">${lead[0]}</span>
</div>`

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
async function shot(html, w, h, out) {
  const p = await browser.newPage({ viewport: { width: w, height: h } })
  await p.setContent(html)
  await p.evaluate(() => document.fonts.ready)
  await p.screenshot({ path: out, omitBackground: true })
  await p.close()
}
await shot(og, 1200, 630, 'qa-output/og.png')
await shot(icon(512, true), 512, 512, 'public/icons/icon-512.png')
await shot(icon(192, true), 192, 192, 'public/icons/icon-192.png')
await shot(icon(180, true), 180, 180, 'public/icons/apple-touch-icon.png')
await browser.close()
execFileSync('python3', ['-c', "from PIL import Image; Image.open('qa-output/og.png').convert('RGB').save('public/og-image.jpg', quality=82, optimize=True, progressive=True)"])
console.log('brand assets written')
