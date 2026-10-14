import { categories, categoryPath, getCategory } from '../data/categories'
import { getProduct, products } from '../data/products'
import { site } from '../data/site'
import { isSoldOut, unitPrice } from '../lib/pricing'

export interface PageMeta {
  title: string
  description: string
  /** Absolute canonical URL. */
  url: string
  /** Absolute share image URL. */
  image: string
  type: 'website' | 'product'
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

const abs = (path: string) => (path.startsWith('http') ? path : `${site.url}${path}`)
const DEFAULT_IMAGE = '/og-image.jpg'

const business = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.contact.phone,
  address: { '@type': 'PostalAddress', streetAddress: site.contact.address, addressCountry: 'BD' },
  openingHours: `Mo-Su ${String(site.hours.open).padStart(2, '0')}:00-${site.hours.close}:00`,
  priceRange: '৳৳',
  image: abs(DEFAULT_IMAGE),
}

/** Title, description, share image and structured data for any path. */
export function metaFor(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, '') || '/'
  const base = { url: abs(path === '/' ? '/' : path), image: abs(DEFAULT_IMAGE), type: 'website' as const }

  if (path === '/') {
    return { ...base, title: `${site.name} — ${site.tagline}`, description: site.description, jsonLd: business }
  }
  const cat = path.match(/^\/menu\/([^/]+)$/)
  if (cat) {
    const c = getCategory(cat[1])
    if (c) return { ...base, title: `${c.title} | ${site.name}`, description: c.intro, image: abs(c.image) }
  }
  const prod = path.match(/^\/product\/([^/]+)$/)
  if (prod) {
    const p = getProduct(prod[1])
    if (p) {
      return {
        ...base,
        type: 'product',
        title: `${p.name} — ৳ ${unitPrice(p).toLocaleString('en-IN')} | ${site.name}`,
        description: p.description,
        image: abs(p.images[0] ?? DEFAULT_IMAGE),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          description: p.description,
          image: p.images.map(abs),
          category: getCategory(p.category)?.label,
          brand: { '@type': 'Brand', name: site.name },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'BDT',
            price: unitPrice(p),
            availability: `https://schema.org/${isSoldOut(p) ? 'OutOfStock' : 'InStock'}`,
            url: abs(path),
          },
        },
      }
    }
  }
  if (path === '/checkout') return { ...base, title: `Checkout | ${site.name}`, description: 'Complete your order — Cash on Delivery across Dhaka and Bangladesh.', noindex: true }
  if (path.startsWith('/order/')) return { ...base, title: `Your order | ${site.name}`, description: 'Your order receipt.', noindex: true }
  if (path === '/design') return { ...base, title: `Design system | ${site.name}`, description: 'Internal style guide.', noindex: true }
  return { ...base, title: `Page not found | ${site.name}`, description: 'This page doesn’t exist.', noindex: true }
}

/** Public, indexable pages rendered to static HTML at build time. */
export const prerenderPaths: string[] = [
  '/',
  ...categories.map((c) => categoryPath(c.slug)),
  ...products.map((p) => `/product/${p.slug}`),
]
