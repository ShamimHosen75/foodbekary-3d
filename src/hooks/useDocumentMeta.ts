import { useEffect } from 'react'
import type { PageMeta } from '../seo/meta'

/** Find a <head> element by selector, creating it if missing; null value removes it. */
function upsert(selector: string, make: () => HTMLElement, attr: string, value: string | null) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (value === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = make()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const metaTag = (key: 'name' | 'property', id: string) => () => {
  const m = document.createElement('meta')
  m.setAttribute(key, id)
  return m
}

/**
 * Keeps <head> in sync on client-side navigation. Prerendered pages already ship
 * the same tags (written by scripts/prerender.mjs from the same metaFor()).
 */
export function useDocumentMeta(m: PageMeta) {
  useEffect(() => {
    document.title = m.title
    upsert('meta[name="description"]', metaTag('name', 'description'), 'content', m.description)
    upsert('meta[name="robots"]', metaTag('name', 'robots'), 'content', m.noindex ? 'noindex' : null)
    upsert('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', m.url)
    for (const [prop, value] of [
      ['og:title', m.title],
      ['og:description', m.description],
      ['og:url', m.url],
      ['og:image', m.image],
      ['og:type', m.type],
    ] as const) {
      upsert(`meta[property="${prop}"]`, metaTag('property', prop), 'content', value)
    }
    const ld = document.head.querySelector('script[type="application/ld+json"]')
    if (m.jsonLd) {
      const script = ld ?? document.head.appendChild(Object.assign(document.createElement('script'), { type: 'application/ld+json' }))
      script.textContent = JSON.stringify(m.jsonLd)
    } else {
      ld?.remove()
    }
  }, [m])
}
