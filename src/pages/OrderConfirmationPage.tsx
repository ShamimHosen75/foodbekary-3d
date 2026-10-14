import { m, useReducedMotion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { TotalsTable } from '../components/cart/TotalsTable'
import { buttonClasses, Container, SectionHeading } from '../components/ui'
import { categoryPath } from '../data/categories'
import { site } from '../data/site'
import { formatPrice } from '../lib/format'
import { whatsappUrl } from '../lib/order'
import { useOrdersStore } from '../store/ordersStore'

export function OrderConfirmationPage() {
  const { id } = useParams()
  const order = useOrdersStore((s) => s.orders.find((o) => o.id === id))
  const reduce = useReducedMotion()

  if (!order) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <SectionHeading as="h1" eyebrow="Order not found" title="We can’t find that receipt." intro="Receipts are saved on the device you ordered from. Check “My orders”, or call us and we’ll look it up." />
        <Link to="/" className={buttonClasses('primary')}>Back to home</Link>
      </Container>
    )
  }

  const { customer } = order
  return (
    <Container size="content" className="max-w-[44rem] py-14 sm:py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <m.span
          aria-hidden="true"
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="grid size-16 place-items-center rounded-full bg-success text-3xl text-white shadow-lift"
        >
          ✓
        </m.span>
        <SectionHeading as="h1" eyebrow={`Order ${order.id}`} title={`Thank you, ${customer.name.split(' ')[0]}!`} intro={`We’ve received your order and will call ${customer.phone} shortly to confirm. Pay ${formatPrice(order.total)} in cash on delivery.`} />
      </div>

      <div className="mt-10 space-y-6 rounded-card border border-line bg-surface p-5 sm:p-7">
        <ul className="space-y-2 text-sm">
          {order.lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-3">
              <span>{l.qty} × {l.name}</span>
              <span className="font-semibold tabular-nums">{formatPrice(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <TotalsTable subtotal={order.subtotal} delivery={order.deliveryFee} deliveryLabel={site.delivery[customer.zone].label} />
        <dl className="grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Deliver to</dt><dd className="font-medium">{customer.name}<br />{customer.address}</dd></div>
          <div><dt className="text-muted">Delivery</dt><dd className="font-medium">{site.delivery[customer.zone].label} · {site.delivery[customer.zone].eta}</dd></div>
          <div><dt className="text-muted">Payment</dt><dd className="font-medium">💵 Cash on Delivery</dd></div>
          {customer.notes && <div><dt className="text-muted">Notes</dt><dd className="font-medium">{customer.notes}</dd></div>}
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={whatsappUrl(order)} target="_blank" rel="noreferrer" className={buttonClasses('outline', 'lg')}>
          💬 {order.channel === 'whatsapp' ? 'Open WhatsApp again' : 'Send order on WhatsApp'}
        </a>
        <Link to={categoryPath('cakes')} className={buttonClasses('primary', 'lg')}>Continue shopping</Link>
      </div>
    </Container>
  )
}
