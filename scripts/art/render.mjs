// Renders placeholder art to WebP. Usage: node scripts/art/render.mjs
import { chromium } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { categoryScenes, heroScenes } from './scenes.mjs'

const tmp = 'qa-output/art'
mkdirSync(tmp, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })

// Seeded bokeh so renders are reproducible.
const bokehScript = () => {
  document.querySelectorAll('.bokeh').forEach((el) => {
    let s = Number(el.dataset.seed) * 9301
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    const hues = el.dataset.hues.split(',').map(Number)
    for (let i = 0; i < Number(el.dataset.n); i++) {
      const d = document.createElement('i')
      const size = 14 + rnd() * 70
      const hue = hues[Math.floor(rnd() * hues.length)]
      d.style.cssText = `position:absolute;left:${rnd() * 100}%;top:${rnd() * 100}%;width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle,hsla(${hue},100%,82%,.95),hsla(${hue},95%,65%,.25) 60%,transparent 72%);filter:blur(${1 + rnd() * 3}px)`
      el.appendChild(d)
    }
  })
}

async function render(name, html, width, height, outDir, sizes) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`)
  await page.evaluate(bokehScript)
  const png = `${tmp}/${name}.png`
  await page.screenshot({ path: png })
  await page.close()
  for (const [w, q] of sizes) {
    execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open('${png}').convert('RGB')
im = im.resize((${w}, round(im.height * ${w} / im.width)), Image.LANCZOS)
im.save('${outDir}/${name}-${w}.webp', 'WEBP', quality=${q}, method=6)
`])
  }
}

for (const [name, html] of heroScenes) await render(name, html, 1600, 1000, 'src/assets/hero', [[1600, 72], [900, 70]])
for (const [name, html] of categoryScenes) await render(name, html, 800, 480, 'src/assets/categories', [[640, 74]])
await browser.close()
rmSync(tmp, { recursive: true, force: true })
console.log('done')
