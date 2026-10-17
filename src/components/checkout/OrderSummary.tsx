import type { ReactNode } from 'react'
import { site } from '../../data/site'
import type { CartItem } from '../../lib/cart'
import { formatPrice } from '../../lib/format'
import { deliveryFee } from '../../lib/order'
import type { DeliveryZone } from '../../lib/validation'
import { TotalsTable } from '../cart/TotalsTable'

export function OrderSummary({ items, zone, children }: { items: CartItem[]; zone: DeliveryZone | ''; children?: ReactNode }) {
  const subtotal = items.reduce((n, i) => n + i.lineTotal, 0)
  return (
    <section aria-labelledby="summary-title" className="space-y-5 rounded-card border border-line bg-surface p-5 sm:p-6 md:sticky md:top-20">
      <h2 id="summary-title" className="text-xl font-semibold">Order summary</h2>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.product.id} className="flex items-center gap-3 text-sm">
            <span className="relative shrink-0">
              <img src={i.product.images[0]} alt="" width={48} height={36} className="h-10 w-12 rounded-lg object-cover" />
              <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent-strong px-1 text-[0.625rem] font-bold text-white">{i.qty}</span>
            </span>
            <span className="min-w-0 flex-1 truncate">{i.product.name}</span>
            <span className="font-semibold tabular-nums">{formatPrice(i.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <TotalsTable subtotal={subtotal} delivery={zone ? deliveryFee(zone) : null} deliveryLabel={zone ? site.delivery[zone].label : undefined} />
      {children}
    </section>
  )
}
