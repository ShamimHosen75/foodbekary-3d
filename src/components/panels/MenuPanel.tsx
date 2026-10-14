import { Link } from 'react-router-dom'
import { categories, categoryPath } from '../../data/categories'
import { site } from '../../data/site'
import { useUiStore, type Panel } from '../../store/uiStore'

const utilities: { panel: Panel; icon: string; label: string }[] = [
  { panel: 'search', icon: '🔍', label: 'Search the menu' },
  { panel: 'favorites', icon: '❤️', label: 'Saved favourites' },
  { panel: 'orders', icon: '📦', label: 'My orders' },
]

/** Content of the "Menu" drawer: categories, utilities, contact. */
export function MenuPanel() {
  const { close, open } = useUiStore()
  return (
    <div className="space-y-8">
      <nav aria-label="Site">
        <ul className="space-y-1">
          <li>
            <Link to="/" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-lg font-semibold hover:bg-cream">
              <span aria-hidden="true">🏠</span> Home
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                to={categoryPath(c.slug)}
                onClick={close}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-lg font-semibold hover:bg-cream"
              >
                <span aria-hidden="true">{c.emoji}</span> {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="space-y-1 border-t border-line pt-6">
        {utilities.map((u) => (
          <li key={u.panel}>
            <button
              type="button"
              onClick={() => open(u.panel)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-cream"
            >
              <span aria-hidden="true">{u.icon}</span> {u.label}
            </button>
          </li>
        ))}
      </ul>

      <address className="space-y-1.5 border-t border-line pt-6 text-sm not-italic text-muted">
        <p className="font-semibold text-ink">{site.hours.label}</p>
        <p>📍 {site.contact.address}</p>
        <p>
          📞 <a className="underline-offset-2 hover:underline" href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`}>{site.contact.phone}</a>
        </p>
        <p>
          💬 <a className="underline-offset-2 hover:underline" href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a>
        </p>
      </address>
    </div>
  )
}
