import { site } from '../data/site'

export type DeliveryZone = keyof typeof site.delivery

export interface CheckoutValues {
  name: string
  phone: string
  zone: DeliveryZone | ''
  address: string
  notes: string
}

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>

export const NOTES_MAX = 300

/**
 * Normalises a Bangladeshi mobile number to 01XXXXXXXXX, accepting spaces,
 * dashes and a +880 / 880 prefix. Returns null when it is not a valid mobile
 * number (operator codes 013–019).
 */
export function normalizeBdPhone(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, '')
  if (digits.startsWith('+880')) digits = digits.slice(3)
  else if (digits.startsWith('880')) digits = digits.slice(2)
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null
}

export function validateCheckout(v: CheckoutValues): CheckoutErrors {
  const e: CheckoutErrors = {}
  const name = v.name.trim()
  if (!name) e.name = 'Please enter your name.'
  else if (name.length < 2) e.name = 'Name must be at least 2 characters.'
  else if (name.length > 60) e.name = 'Name must be 60 characters or fewer.'

  if (!v.phone.trim()) e.phone = 'Please enter your mobile number.'
  else if (!normalizeBdPhone(v.phone)) e.phone = 'Enter a valid Bangladeshi mobile number, e.g. 01712345678.'

  if (!v.zone) e.zone = 'Choose where we are delivering.'

  const address = v.address.trim()
  if (!address) e.address = 'Please enter your delivery address.'
  else if (address.length < 10) e.address = 'Add a little more detail — house, road and area.'

  if (v.notes.length > NOTES_MAX) e.notes = `Notes must be ${NOTES_MAX} characters or fewer.`
  return e
}
