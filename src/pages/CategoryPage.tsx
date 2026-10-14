import { useDeferredValue } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { FilterChips } from '../components/product/FilterChips'
import { ProductGrid } from '../components/product/ProductGrid'
import { SearchField } from '../components/product/SearchField'
import { Button, Container, SectionHeading } from '../components/ui'
import { getCategory } from '../data/categories'
import { collections } from '../data/collections'
import { productsIn } from '../data/products'
import { filterProducts } from '../lib/search'
import { NotFoundPage } from './NotFoundPage'

/** Filter + search live in the URL (?f=chocolate&q=truffle) so results are shareable and Back works. */
export function CategoryPage() {
  const category = getCategory(useParams().category)
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const deferredQuery = useDeferredValue(query)

  if (!category) return <NotFoundPage />

  const options = collections[category.slug]
  const rawFilter = params.get('f')
  const filter = options.some((o) => o.id === rawFilter) ? rawFilter : null
  const all = productsIn(category.slug)
  const results = filterProducts(all, filter, deferredQuery)

  const update = (key: 'f' | 'q', value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: key === 'q', preventScrollReset: true },
    )

  return (
    <Container size="content" className="max-w-[60rem] pt-14 pb-24 sm:pt-20">
      <SectionHeading as="h1" eyebrow={category.eyebrow} title={category.title} intro={category.intro} className="mb-8" />
      <div className="mb-10 flex flex-col items-center gap-5">
        <FilterChips allLabel={`All ${category.name}`} allCount={all.length} options={options} value={filter} onChange={(id) => update('f', id)} />
        <SearchField
          label={`Search ${category.name.toLowerCase()}`}
          placeholder={`Search ${category.name.toLowerCase()} by name or ingredient…`}
          value={query}
          onChange={(v) => update('q', v.trimStart() || null)}
        />
      </div>

      <h2 className="sr-only">
        <span role="status" aria-live="polite">
          {results.length} {results.length === 1 ? 'product' : 'products'} shown
        </span>
      </h2>

      {results.length > 0 ? (
        <ProductGrid products={results} animationKey={`${category.slug}|${filter ?? 'all'}`} />
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-line py-16 text-center">
          <span aria-hidden="true" className="text-4xl">🧺</span>
          <p className="font-display text-lg font-semibold">Nothing on this tray matches{query && ` “${query}”`}.</p>
          <Button variant="outline" onClick={() => setParams({}, { replace: true, preventScrollReset: true })}>
            Clear filters
          </Button>
        </div>
      )}
    </Container>
  )
}
