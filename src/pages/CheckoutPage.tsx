import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckoutForm } from '../components/checkout/CheckoutForm'
import { MobileCheckoutBar } from '../components/checkout/MobileCheckoutBar'
import { OrderSummary } from '../components/checkout/OrderSummary'
import { clearCheckoutDraft, useCheckoutForm } from '../components/checkout/useCheckoutForm'
import { Button, buttonClasses, Container, SectionHeading } from '../components/ui'
import { categoryPath } from '../data/categories'
import { resolveCart } from '../lib/cart'
import { formatPrice } from '../lib/format'
import { buildOrder, deliveryFee, whatsappUrl, type Order } from '../lib/order'
import { useCartStore } from '../store/cartStore'
import { useOrdersStore } from '../store/ordersStore'

/** Stand-in for a network round-trip until orders go to a backend. */
const SUBMIT_DELAY_MS = 600

export function CheckoutPage() {
  const lines = useCartStore((s) => s.lines)
  const clearCart = useCartStore((s) => s.clear)
  const addOrder = useOrdersStore((s) => s.add)
  const navigate = useNavigate()
  const form = useCheckoutForm()
  const [busy, setBusy] = useState<Order['channel'] | null>(null)
  const lock = useRef(false) // synchronous guard: a second click in the same tick can't slip past state
  const cart = resolveCart(lines)
  const blocked = cart.items.some((i) => i.issue === 'sold-out')

  if (cart.orderable.length === 0 && !busy) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <span aria-hidden="true" className="text-6xl">🧺</span>
        <SectionHeading
          as="h1"
          title={cart.items.length ? 'Those items just sold out' : 'Your basket is empty'}
          intro={cart.items.length ? 'Everything in your basket is gone for today. Fresh batches go up every morning.' : 'Add something fresh from the counter, then come back to check out.'}
        />
        <Link to={categoryPath('cakes')} className={buttonClasses('accent', 'lg')}>Browse the menu</Link>
      </Container>
    )
  }

  async function place(channel: Order['channel']) {
    if (lock.current || blocked) return
    const errors = form.validateAll()
    const first = Object.keys(errors)[0]
    if (first) {
      document.getElementById(first === 'zone' ? 'zone-error' : first)?.closest('fieldset')?.scrollIntoView({ block: 'center' })
      ;(document.getElementById(first) ?? document.querySelector<HTMLInputElement>('input[name="zone"]'))?.focus({ preventScroll: true })
      return
    }
    lock.current = true
    setBusy(channel)
    const order = buildOrder(form.values, cart.orderable, channel)
    // Must open synchronously inside the click, or popup blockers stop it.
    if (channel === 'whatsapp') window.open(whatsappUrl(order), '_blank', 'noopener,noreferrer')
    await new Promise((r) => setTimeout(r, SUBMIT_DELAY_MS))
    addOrder(order)
    clearCart()
    clearCheckoutDraft()
    navigate(`/order/${order.id}`, { replace: true })
  }

  const total = cart.subtotal + deliveryFee(form.values.zone)
  // Summary banner only after a submit attempt — showing it on blur would push the form down mid-click.
  const errorCount = form.submitted ? Object.values(form.errors).filter(Boolean).length : 0

  return (
    <Container size="content" className="max-w-[64rem] pt-10 pb-24 sm:pt-14">
      <SectionHeading as="h1" eyebrow="Almost there" title="Checkout" align="left" className="mb-8" />
      {errorCount > 0 && (
        <p role="alert" className="mb-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} below to place your order.
        </p>
      )}
      <form
        id="checkout-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          void place('web')
        }}
        className="grid gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
        aria-busy={busy !== null}
      >
        <CheckoutForm values={form.values} errors={form.errors} set={form.set} blur={form.blur} />
        <div>
          <OrderSummary items={cart.orderable} zone={form.values.zone}>
            {blocked && <p role="alert" className="text-sm font-semibold text-danger">Some items sold out — remove them from your basket first.</p>}
            <div className="space-y-3">
              {/* On phones the sticky bar carries this action, so keep a single "Place order" per screen. */}
              <Button type="submit" size="lg" className="w-full max-md:hidden" disabled={busy !== null || blocked}>
                {busy === 'web' ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
              </Button>
              <Button type="button" variant="outline" size="lg" className="w-full" disabled={busy !== null || blocked} onClick={() => void place('whatsapp')}>
                {busy === 'whatsapp' ? 'Opening WhatsApp…' : '💬 Order via WhatsApp'}
              </Button>
              <p className="text-center text-xs text-muted">Cash on Delivery · we’ll call to confirm before baking.</p>
            </div>
          </OrderSummary>
        </div>
      </form>
      <MobileCheckoutBar formId="checkout-form" total={total} busy={busy !== null} disabled={blocked} />
    </Container>
  )
}
