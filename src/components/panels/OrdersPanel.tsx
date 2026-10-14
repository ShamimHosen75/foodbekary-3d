import { Link } from 'react-router-dom'
import { formatPrice } from '../../lib/format'
import { useOrdersStore } from '../../store/ordersStore'
import { ComingSoonPanel } from './ComingSoonPanel'

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dhaka' })

export function OrdersPanel() {
  const orders = useOrdersStore((s) => s.orders)
  if (orders.length === 0) return <ComingSoonPanel icon="📦" text="You haven’t placed an order on this device yet." />
  return (
    <ul className="space-y-2">
      {orders.map((o) => (
        <li key={o.id} className="relative rounded-xl border border-line p-3 transition-colors hover:bg-cream">
          <Link to={`/order/${o.id}`} className="font-display font-semibold after:absolute after:inset-0 after:content-['']">
            {o.id}
          </Link>
          <p className="text-xs text-muted">
            {dateFmt.format(new Date(o.createdAt))} · {o.lines.reduce((n, l) => n + l.qty, 0)} items · {formatPrice(o.total)}
          </p>
          <p className="mt-1 inline-block rounded-full bg-success/10 px-2 py-0.5 text-[0.6875rem] font-semibold text-success">Received · Cash on Delivery</p>
        </li>
      ))}
    </ul>
  )
}
