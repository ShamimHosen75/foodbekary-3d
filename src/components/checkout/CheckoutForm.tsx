import type { ReactNode } from 'react'
import { site } from '../../data/site'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import { NOTES_MAX, type CheckoutErrors, type CheckoutValues, type DeliveryZone } from '../../lib/validation'
import { Field } from './Field'
import { describedBy, inputClass } from './fieldStyles'

export interface CheckoutFormProps {
  values: CheckoutValues
  errors: CheckoutErrors
  set: <K extends keyof CheckoutValues>(key: K, value: CheckoutValues[K]) => void
  blur: (key: keyof CheckoutValues) => void
}

const zones = Object.entries(site.delivery) as [DeliveryZone, (typeof site.delivery)[DeliveryZone]][]
/** Card-styled fieldset. Styling sits on a wrapper so the <legend> lays out normally. */
function FormSection({ title, describedBy, children }: { title: string; describedBy?: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
      <fieldset className="min-w-0 space-y-5" aria-describedby={describedBy}>
        <legend className="mb-5 font-display text-xl font-semibold">{title}</legend>
        {children}
      </fieldset>
    </div>
  )
}

export function CheckoutForm({ values, errors, set, blur }: CheckoutFormProps) {
  return (
    <div className="space-y-6">
      <FormSection title="Your details">
        <Field id="name" label="Full name" hint="As it should appear on your receipt" error={errors.name}>
          <input id="name" name="name" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} onBlur={() => blur('name')} className={inputClass(!!errors.name)} {...describedBy('name', errors.name, 'hint')} />
        </Field>
        <Field id="phone" label="Mobile number" hint="We’ll call to confirm. Format: 01XXXXXXXXX" error={errors.phone}>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01712345678" value={values.phone} onChange={(e) => set('phone', e.target.value)} onBlur={() => blur('phone')} className={inputClass(!!errors.phone)} {...describedBy('phone', errors.phone, 'hint')} />
        </Field>
      </FormSection>

      <FormSection title="Delivery" describedBy={errors.zone ? 'zone-error' : undefined}>
        <div role="radiogroup" aria-label="Delivery area" aria-invalid={errors.zone ? true : undefined} className="grid gap-3 sm:grid-cols-2">
          {zones.map(([id, z]) => (
            <label
              key={id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-strong',
                values.zone === id ? 'border-ink bg-cream' : errors.zone ? 'border-danger' : 'border-line hover:border-ink/40',
              )}
            >
              <input type="radio" name="zone" value={id} checked={values.zone === id} onChange={() => set('zone', id)} className="mt-1 accent-ink" />
              <span className="flex-1">
                <span className="flex justify-between font-semibold">
                  {z.label} <span className="tabular-nums">{formatPrice(z.fee)}</span>
                </span>
                <span className="block text-xs text-muted">{z.eta}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.zone && <p id="zone-error" className="text-xs leading-4 font-semibold text-danger">{errors.zone}</p>}
        <Field id="address" label="Full address" hint="House, road, area and any landmark" error={errors.address}>
          <textarea id="address" name="address" rows={3} autoComplete="street-address" value={values.address} onChange={(e) => set('address', e.target.value)} onBlur={() => blur('address')} className={cn(inputClass(!!errors.address), 'resize-y')} {...describedBy('address', errors.address, 'hint')} />
        </Field>
        <Field id="notes" label="Order notes" optional hint={`Cake message, delivery time… (${values.notes.length}/${NOTES_MAX})`} error={errors.notes}>
          <textarea id="notes" name="notes" rows={2} value={values.notes} onChange={(e) => set('notes', e.target.value)} onBlur={() => blur('notes')} className={cn(inputClass(!!errors.notes), 'resize-y')} {...describedBy('notes', errors.notes, 'hint')} />
        </Field>
      </FormSection>

      <FormSection title="Payment">
        <label className="flex items-start gap-3 rounded-xl border border-ink bg-cream p-4">
          <input type="radio" name="payment" checked readOnly className="mt-1 accent-ink" />
          <span>
            <span className="block font-semibold">💵 Cash on Delivery</span>
            <span className="block text-xs text-muted">Pay the rider in cash when your order arrives.</span>
          </span>
        </label>
      </FormSection>
    </div>
  )
}
