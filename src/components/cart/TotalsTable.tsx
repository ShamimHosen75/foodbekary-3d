import { formatPrice } from '../../lib/format'

export interface TotalsTableProps {
  subtotal: number
  /** null = not chosen yet. */
  delivery: number | null
  deliveryLabel?: string
}

export function TotalsTable({ subtotal, delivery, deliveryLabel }: TotalsTableProps) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="font-semibold tabular-nums" data-testid="subtotal">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Delivery{deliveryLabel && ` (${deliveryLabel})`}</dt>
        <dd className="font-semibold tabular-nums" data-testid="delivery">{delivery === null ? 'Choose area' : formatPrice(delivery)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-base">
        <dt className="font-display font-semibold">Total</dt>
        <dd className="font-bold tabular-nums" data-testid="total">{formatPrice(subtotal + (delivery ?? 0))}</dd>
      </div>
    </dl>
  )
}
