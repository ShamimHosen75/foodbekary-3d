import { Link } from 'react-router-dom'
import { categories, categoryPath } from '../../data/categories'
import { site } from '../../data/site'
import { useUiStore, type Panel } from '../../store/uiStore'
import { FooterNewsletter } from './FooterNewsletter'

const care: { panel: Panel; icon: string; label: string }[] = [
  { panel: 'search', icon: '🔍', label: 'Search the menu (Ctrl+K)' },
  { panel: 'cart', icon: '🛒', label: 'View your basket' },
  { panel: 'favorites', icon: '❤️', label: 'Saved favourites' },
  { panel: 'orders', icon: '📦', label: 'Order receipts & status' },
]

const heading = 'mb-4 font-display text-base font-semibold text-white'
const link = 'text-sm text-forest-ink transition-colors hover:text-white'
const pill = 'inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-gold-light transition-colors hover:text-white'

export function Footer() {
  const open = useUiStore((s) => s.open)
  return (
    <footer className="bg-forest text-forest-ink">
      <div className="mx-auto grid max-w-[64rem] grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.5fr]">
        <div className="space-y-4">
          <p className="font-display text-xl font-bold text-white">
            {site.wordmark.lead}<span className="text-accent">{site.wordmark.accent}</span>
          </p>
          <p className="text-sm leading-relaxed">{site.description}</p>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-xs text-white">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#6fcf73]" />
            <span><strong>Open daily:</strong> {site.hours.label.replace('Daily ', '')}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <a className={pill} href={site.social.instagram} target="_blank" rel="noreferrer">📸 Instagram</a>
            <a className={pill} href={site.social.facebook} target="_blank" rel="noreferrer">📘 Facebook</a>
            <a className={pill} href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>
          </div>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className={heading}>Explore the menu</h2>
          <ul className="space-y-2.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link className={link} to={categoryPath(c.slug)}>
                  <span aria-hidden="true">{c.emoji}</span> {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-care">
          <h2 id="footer-care" className={heading}>Customer care</h2>
          <ul className="space-y-2.5">
            {care.map((c) => (
              <li key={c.panel}>
                <button type="button" className={`${link} cursor-pointer text-left`} onClick={() => open(c.panel)}>
                  <span aria-hidden="true">{c.icon}</span> {c.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4">
          <h2 className={heading.replace('mb-4 ', '')}>Fresh Batch Club 🥐</h2>
          <p className="text-sm leading-relaxed">
            Early-morning batch alerts, weekend specials and 10% off your first order.
          </p>
          <FooterNewsletter />
          <div>
            <p className="mb-2 text-xs font-semibold text-white">How to pay</p>
            <ul className="flex flex-wrap gap-2 text-xs">
              <li className="rounded-full bg-white/8 px-3 py-1.5">💵 Cash on Delivery</li>
              <li className="rounded-full bg-white/8 px-3 py-1.5">💬 Order on WhatsApp</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-2 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <span>📍 {site.contact.address}</span>
            <a className="hover:text-white" href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`}>📞 {site.contact.phone}</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
