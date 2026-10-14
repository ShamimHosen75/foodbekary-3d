import { site } from '../data/site'
import type { CartItem } from './cart'
import { formatPrice } from './format'
import { normalizeBdPhone, type CheckoutValues, type DeliveryZone } from './validation'

export interface OrderLine {
  productId: string
  name: string
  unit: number
  qty: number
  lineTotal: number
}

export interface Order {
  id: string
  createdAt: string
  customer: { name: string; phone: string; zone: DeliveryZone; address: string; notes: string }
  lines: OrderLine[]
  subtotal: number
  deliveryFee: number
  total: number
  payment: 'cash-on-delivery'
  channel: 'web' | 'whatsapp'
  status: 'received'
}

export const deliveryFee = (zone: DeliveryZone | '') => (zone ? site.delivery[zone].fee : 0)

/** FB-YYMMDD-XXXX, random part from crypto so ids don't collide between tabs. */
export function newOrderId(now = new Date()): string {
  const d = now.toISOString().slice(2, 10).replace(/-/g, '')
  const bytes = crypto.getRandomValues(new Uint8Array(3))
  const rand = Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 4).toUpperCase()
  return `FB-${d}-${rand}`
}

/** Snapshot the order so later price/stock changes never alter a receipt. */
export function buildOrder(values: CheckoutValues, items: CartItem[], channel: Order['channel'], now = new Date()): Order {
  if (!values.zone) throw new Error('Delivery zone required')
  const lines = items.map((i) => ({ productId: i.product.id, name: i.product.name, unit: i.unit, qty: i.qty, lineTotal: i.lineTotal }))
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0)
  const fee = deliveryFee(values.zone)
  return {
    id: newOrderId(now),
    createdAt: now.toISOString(),
    customer: {
      name: values.name.trim(),
      phone: normalizeBdPhone(values.phone) ?? values.phone.trim(),
      zone: values.zone,
      address: values.address.trim(),
      notes: values.notes.trim(),
    },
    lines,
    subtotal,
    deliveryFee: fee,
    total: subtotal + fee,
    payment: 'cash-on-delivery',
    channel,
    status: 'received',
  }
}

export function whatsappMessage(o: Order): string {
  const items = o.lines.map((l) => `• ${l.qty} × ${l.name} — ${formatPrice(l.lineTotal)}`).join('\n')
  return [
    `🧁 New order ${o.id}`,
    '',
    items,
    '',
    `Subtotal: ${formatPrice(o.subtotal)}`,
    `Delivery (${site.delivery[o.customer.zone].label}): ${formatPrice(o.deliveryFee)}`,
    `Total: ${formatPrice(o.total)} — Cash on Delivery`,
    '',
    `Name: ${o.customer.name}`,
    `Phone: ${o.customer.phone}`,
    `Address: ${o.customer.address}`,
    ...(o.customer.notes ? [`Notes: ${o.customer.notes}`] : []),
  ].join('\n')
}

export const whatsappUrl = (o: Order) =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage(o))}`
