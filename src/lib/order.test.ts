import { resolveCart } from './cart'
import { buildOrder, newOrderId, whatsappMessage, whatsappUrl } from './order'

const values = { name: ' Tanvir ', phone: '+880 1812-345678', zone: 'outsideDhaka' as const, address: 'Flat 3B, Road 7, Uttara', notes: 'Ring twice' }
const items = resolveCart([
  { productId: 'nutella-stuffed-cookie', qty: 2 }, // 180 × 2
  { productId: 'mango-mousse-slice', qty: 1 }, // sale 210
]).orderable

describe('order', () => {
  it('builds a priced snapshot with delivery and a normalised phone', () => {
    const o = buildOrder(values, items, 'web', new Date('2026-10-14T10:00:00Z'))
    expect(o.subtotal).toBe(570)
    expect(o.deliveryFee).toBe(120)
    expect(o.total).toBe(690)
    expect(o.customer).toMatchObject({ name: 'Tanvir', phone: '01812345678' })
    expect(o.id).toMatch(/^FB-261014-[A-Z0-9]{4}$/)
  })

  it('generates distinct ids', () => {
    const ids = new Set(Array.from({ length: 200 }, () => newOrderId()))
    expect(ids.size).toBeGreaterThan(195)
  })

  it('writes a readable WhatsApp summary and a wa.me link', () => {
    const o = buildOrder(values, items, 'whatsapp')
    const msg = whatsappMessage(o)
    expect(msg).toContain('2 × Nutella Stuffed Cookie — ৳ 360')
    expect(msg).toContain('Total: ৳ 690 — Cash on Delivery')
    expect(msg).toContain('Notes: Ring twice')
    expect(whatsappUrl(o)).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
    expect(decodeURIComponent(whatsappUrl(o).split('text=')[1]!)).toBe(msg)
  })
})
