// Local static server that behaves like Netlify for the built site:
// files and /dir/index.html first, otherwise the SPA shell (app.html) with status 200.
// Usage: node scripts/serve.mjs [port]
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'

// Compressed bodies are cached per file, like a CDN serving pre-compressed assets.
const cache = new Map()
const compress = (file, body, enc, mtime) => {
  const key = `${enc}:${file}:${mtime}` // mtime: a rebuild never serves stale bytes
  if (!cache.has(key)) cache.set(key, enc === 'br' ? brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } }) : gzipSync(body, { level: 9 }))
  return cache.get(key)
}

const root = 'dist'
const port = Number(process.argv[2] ?? 4173)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.json': 'application/json' }

async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  for (const candidate of [clean, join(clean, 'index.html')]) {
    const file = join(root, candidate)
    try { if ((await stat(file)).isFile()) return file } catch { /* try next */ }
  }
  return null
}

createServer(async (req, res) => {
  const file = (await resolve(req.url ?? '/')) ?? join(root, 'app.html')
  let body = await readFile(file)
  const info = await stat(file)
  const type = types[extname(file)] ?? 'application/octet-stream'
  const headers = { 'content-type': type, 'cache-control': file.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache' }
  // Compress text like Netlify does (brotli preferred).
  const accept = String(req.headers['accept-encoding'] ?? '')
  if (/text|javascript|json|xml|svg|manifest/.test(type)) {
    if (accept.includes('br')) { body = compress(file, body, 'br', info.mtimeMs); headers['content-encoding'] = 'br' }
    else if (accept.includes('gzip')) { body = compress(file, body, 'gzip', info.mtimeMs); headers['content-encoding'] = 'gzip' }
    headers.vary = 'accept-encoding'
  }
  res.writeHead(200, headers)
  res.end(body)
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}`))
