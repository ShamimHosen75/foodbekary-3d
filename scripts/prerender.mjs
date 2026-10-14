// Build step: renders every public page to static HTML with its own <head> (title, description,
// canonical, Open Graph, JSON-LD), writes the client-only shell (app.html) and sitemap.xml.
// Runs after `vite build --manifest` and `vite build --ssr src/entry-server.tsx --outDir dist-server`.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = 'dist'
const { render, metaFor, prerenderPaths } = await import(pathToFileURL('dist-server/entry-server.js').href)
const template = await readFile(join(dist, 'index.html'), 'utf8')
const manifest = JSON.parse(await readFile(join(dist, '.vite/manifest.json'), 'utf8'))

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Page chunk to modulepreload so a prerendered page hydrates without a request waterfall. */
const pageChunk = (path) => {
  const page = path === '/' ? null : path.startsWith('/menu/') ? 'CategoryPage' : path.startsWith('/product/') ? 'ProductPage' : path === '/checkout' ? 'CheckoutPage' : null
  const entry = page && manifest[`src/pages/${page}.tsx`]
  if (!entry) return []
  return [entry.file, ...(entry.imports ?? []).map((k) => manifest[k]?.file)].filter(Boolean)
}

function headFor(path, html) {
  const m = metaFor(path)
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${esc(m.url)}" />`,
    `<meta property="og:type" content="${m.type}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(m.url)}" />`,
    `<meta property="og:image" content="${esc(m.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
  if (m.noindex) tags.push('<meta name="robots" content="noindex" />')
  if (m.jsonLd) tags.push(`<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>`)
  // Preload the high-priority (LCP) image found in the rendered markup.
  const lcp = html.match(/<img[^>]*fetchpriority="high"[^>]*>/i)?.[0]
  if (lcp) {
    const src = lcp.match(/\ssrc="([^"]+)"/)?.[1]
    const srcset = lcp.match(/\ssrcset="([^"]+)"/i)?.[1]
    if (src) tags.push(`<link rel="preload" as="image" href="${src}"${srcset ? ` imagesrcset="${srcset}" imagesizes="100vw"` : ''} fetchpriority="high" />`)
  }
  for (const file of pageChunk(path)) tags.push(`<link rel="modulepreload" crossorigin href="/${file}" />`)
  return tags.join('\n    ')
}

const stripDefaults = (html) =>
  html.replace(/<title>[\s\S]*?<\/title>\s*/, '').replace(/<meta name="description"[^>]*>\s*/, '')

// 1. Client-only shell for /checkout, /order/*, 404s (Netlify serves it via the SPA rewrite).
//    Checkout is its main visitor, so its chunk is preloaded to start in parallel with the app.
const shellPreloads = pageChunk('/checkout').map((f) => `<link rel="modulepreload" crossorigin href="/${f}" />`).join('\n    ')
await writeFile(join(dist, 'app.html'), template.replace('</head>', `    ${shellPreloads}\n  </head>`))

// 2. One HTML file per public page.
let count = 0
for (const path of prerenderPaths) {
  const body = await render(path)
  const html = stripDefaults(template)
    .replace('</head>', `    ${headFor(path, body)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
  count++
}

// 3. Sitemap.
const today = new Date().toISOString().slice(0, 10)
const urls = prerenderPaths.map((p) => `  <url><loc>${metaFor(p).url}</loc><lastmod>${today}</lastmod></url>`).join('\n')
await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)

console.log(`prerendered ${count} pages + app.html + sitemap.xml`)
