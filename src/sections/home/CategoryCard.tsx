import { Link } from 'react-router-dom'
import { Badge, buttonClasses, Card } from '../../components/ui'
import { categoryPath, type Category } from '../../data/categories'
import { getCategoryStats } from '../../data/categoryStats'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'

/** Whole card is clickable via a stretched link on the CTA (one tab stop per card). */
export function CategoryCard({ category }: { category: Category }) {
  const { count, fromPrice } = getCategoryStats(category.slug)
  return (
    <Card interactive as="article" className="h-full">
      <div className="relative aspect-[5/3] overflow-hidden bg-sand">
        <img
          src={category.image}
          alt=""
          width={640}
          height={384}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover/card:scale-105"
        />
        <Badge className="absolute top-3 right-3">{count} items</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="text-xl font-semibold transition-colors duration-200 group-hover/card:text-accent-ink">
          {category.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{category.blurb}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-sm font-bold whitespace-nowrap">
            <span className="font-medium text-muted">From </span>
            {formatPrice(fromPrice)}
          </p>
          <Link
            to={categoryPath(category.slug)}
            className={cn(
              buttonClasses('accent', 'sm'),
              // No press-scale: a transform would shrink the stretched ::after hit area mid-click.
              'active:scale-none group-hover/card:bg-ink after:absolute after:inset-0 after:content-[""]',
            )}
          >
            Explore {category.name} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </Card>
  )
}
