import { NavLink } from 'react-router-dom'
import { categories, categoryPath } from '../../data/categories'
import { cn } from '../../lib/cn'

/** Segmented pill tabs shown in the header on category pages. */
export function CategoryTabs({ className }: { className?: string }) {
  return (
    <nav aria-label="Menu categories" className={className}>
      <ul className="flex w-max items-center gap-1 rounded-full border border-line bg-surface/70 p-1">
        {categories.map((c) => (
          <li key={c.slug}>
            <NavLink
              to={categoryPath(c.slug)}
              className={({ isActive }) =>
                cn(
                  'block rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-200',
                  isActive ? 'bg-ink text-white' : 'text-muted hover:text-ink',
                )
              }
            >
              {c.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
