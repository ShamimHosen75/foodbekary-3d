import { Link, useParams } from 'react-router-dom'
import { FavoriteButton } from '../components/product/FavoriteButton'
import { PriceTag } from '../components/product/PriceTag'
import { ProductCard } from '../components/product/ProductCard'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductInfo } from '../components/product/ProductInfo'
import { PurchaseBox } from '../components/product/PurchaseBox'
import { Badge, Container } from '../components/ui'
import { categoryPath, getCategory } from '../data/categories'
import { getProduct, productsIn, type Product } from '../data/products'
import { isSoldOut } from '../lib/pricing'
import { NotFoundPage } from './NotFoundPage'

/** Up to three from the same category, those sharing a collection first. */
function related(p: Product): Product[] {
  const shared = (o: Product) => o.collections.filter((c) => p.collections.includes(c)).length
  return productsIn(p.category)
    .filter((o) => o.id !== p.id)
    .sort((a, b) => shared(b) - shared(a))
    .slice(0, 3)
}

export function ProductPage() {
  const product = getProduct(useParams().slug)
  if (!product) return <NotFoundPage />
  const category = getCategory(product.category)

  return (
    <Container size="content" className="max-w-[60rem] pt-8 pb-24">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap gap-1.5">
          <li><Link to="/" className="hover:text-ink">Home</Link> /</li>
          {category && <li><Link to={categoryPath(category.slug)} className="hover:text-ink">{category.name}</Link> /</li>}
          <li aria-current="page" className="font-medium text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <div className="relative">
          <ProductGallery key={product.id} images={product.images} name={product.name} priority />
          <div className="absolute top-3 right-3 left-3 flex items-start justify-between">
            {isSoldOut(product) ? <Badge variant="neutral" className="bg-surface/90">Sold out</Badge> : product.badge ? <Badge variant="accent">{product.badge}</Badge> : <span />}
            <FavoriteButton productId={product.id} name={product.name} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-eyebrow font-semibold text-accent-ink uppercase">{category?.label}</p>
          <h1 className="-mt-2 text-[2rem] leading-tight font-semibold sm:text-[2.5rem]">{product.name}</h1>
          <PriceTag product={product} className="text-2xl" />
          <p className="leading-relaxed text-muted">{product.description}</p>
          <ProductInfo product={product} headingLevel="h2" />
          <div className="pt-2">
            <PurchaseBox key={product.id} product={product} />
          </div>
        </div>
      </div>

      <section aria-labelledby="related-title" className="mt-20">
        <h2 id="related-title" className="mb-6 text-2xl font-semibold">You might also like</h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related(product).map((p) => (
            <li key={p.id}><ProductCard product={p} /></li>
          ))}
        </ul>
      </section>
    </Container>
  )
}
