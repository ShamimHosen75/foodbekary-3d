import { useEffect, useState } from 'react'
import { validateCheckout, type CheckoutErrors, type CheckoutValues } from '../../lib/validation'

const DRAFT_KEY = 'foodbekary-checkout-draft'
const empty: CheckoutValues = { name: '', phone: '', zone: '', address: '', notes: '' }

function loadDraft(): CheckoutValues {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    return raw ? { ...empty, ...(JSON.parse(raw) as Partial<CheckoutValues>) } : empty
  } catch {
    return empty
  }
}

export const clearCheckoutDraft = () => {
  try {
    sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* storage unavailable — nothing to clear */
  }
}

/**
 * Checkout form state. Fields validate on blur; after the first submit attempt
 * every change re-validates so errors disappear as soon as they are fixed.
 * The draft survives navigating away (sessionStorage).
 */
export function useCheckoutForm() {
  const [values, setValues] = useState<CheckoutValues>(loadDraft)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values))
    } catch {
      /* private mode etc. — draft just won't persist */
    }
  }, [values])

  const set = <K extends keyof CheckoutValues>(key: K, value: CheckoutValues[K]) => {
    const next = { ...values, [key]: value }
    setValues(next)
    if (submitted || errors[key]) setErrors((e) => ({ ...e, [key]: validateCheckout(next)[key] }))
  }

  const blur = (key: keyof CheckoutValues) => {
    if (values[key] === '' && !submitted) return // don't scold untouched empty fields
    setErrors((e) => ({ ...e, [key]: validateCheckout(values)[key] }))
  }

  /** Validates everything; returns the errors (empty object = valid). */
  const validateAll = () => {
    const all = validateCheckout(values)
    setSubmitted(true)
    setErrors(all)
    return all
  }

  return { values, errors, submitted, set, blur, validateAll }
}
