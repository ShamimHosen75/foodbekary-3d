import { useDeferredValue, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategory } from '../../data/categories'
import { products } from '../../data/products'
import { filterProducts } from '../../lib/search'
import { SearchField } from '../product/SearchField'
import { ProductRow } from './ProductRow'

const popular = products.filter((p) => p.collections.includes('bestsellers')).slice(0, 5)

/** Whole-menu search (Ctrl/⌘+K). Enter opens the first result. */
export function SearchPanel() {
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const navigate = useNavigate()
  const results = deferred.trim() ? filterProducts(products, null, deferred).slice(0, 8) : popular

  return (
    <div className="space-y-4">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          if (deferred.trim() && results[0]) navigate(`/product/${results[0].slug}`)
        }}
      >
        <SearchField label="Search the whole menu" placeholder="Cakes, cookies, ingredients…" value={query} onChange={setQuery} autoFocus className="max-w-none" />
      </form>
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">
        {deferred.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Popular right now'}
      </p>
      {results.length ? (
        <ul className="space-y-1">
          {results.map((p) => (
            <li key={p.id} className="relative">
              <ProductRow product={p} meta={getCategory(p.category)?.name} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-sm text-muted">No matches for “{deferred}”. Try “chocolate” or “mango”.</p>
      )}
    </div>
  )
}
