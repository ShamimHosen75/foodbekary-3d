import { Badge, Button, Card, Chip, IconButton, Tag } from '../../components/ui'
import { formatPrice } from '../../lib/format'
import { useState } from 'react'

const filters = ['All Cakes (8)', '⭐ Bestsellers', '🍫 Chocolate', '🍓 Berries'] as const

export function ComponentGallery() {
  const [active, setActive] = useState<string>(filters[0])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Explore menu</Button>
        <Button variant="accent">Add to cart</Button>
        <Button variant="outline">Order ahead</Button>
        <Button variant="gold">Subscribe</Button>
        <Button variant="ghost">Ghost</Button>
        <Button size="sm" variant="accent">Small</Button>
        <Button size="lg">Large · {formatPrice(10750)}</Button>
        <Button disabled>Disabled</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <IconButton label="Search">🔍</IconButton>
        <IconButton label="Favourites">❤️</IconButton>
        <IconButton label="My orders">📦</IconButton>
        <Badge variant="dark">Bestseller</Badge>
        <Badge variant="accent">Fresh daily</Badge>
        <Badge variant="soft">Soft tint</Badge>
        <Badge variant="neutral">🌿 100% fresh</Badge>
        <Tag>✨ Madagascar vanilla</Tag>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Example filter">
        {filters.map((f) => (
          <Chip key={f} active={active === f} onClick={() => setActive(f)}>
            {f}
          </Chip>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <Card key={n} interactive as="article">
            <div className="relative h-36 bg-gradient-to-br from-accent-tint via-cream to-gold/40">
              <Badge className="absolute top-3 right-3">{n === 1 ? 'Bestseller' : 'Popular'}</Badge>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h4 className="text-lg font-semibold transition-colors group-hover/card:text-accent-ink">
                Sample product {n}
              </h4>
              <p className="text-sm leading-relaxed text-muted">
                A short three-line description that shows how card body copy wraps.
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
                <span className="text-sm font-bold">{formatPrice(1800 + n * 300)}</span>
                <Button size="sm" variant="accent">Add to cart</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
