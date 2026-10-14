import { normalizeBdPhone, validateCheckout, type CheckoutValues } from './validation'

describe('normalizeBdPhone', () => {
  it.each([
    ['01712345678', '01712345678'],
    ['017-1234-5678', '01712345678'],
    ['+880 1712 345678', '01712345678'],
    ['8801912345678', '01912345678'],
    ['01312345678', '01312345678'],
  ])('accepts %s', (input, out) => expect(normalizeBdPhone(input)).toBe(out))

  it.each(['0171234567', '017123456789', '01212345678', '02712345678', '+8801212345678', 'abc', ''])(
    'rejects %s',
    (input) => expect(normalizeBdPhone(input)).toBeNull(),
  )
})

describe('validateCheckout', () => {
  const ok: CheckoutValues = { name: 'Nusrat', phone: '01712345678', zone: 'insideDhaka', address: 'House 12, Road 5, Dhanmondi', notes: '' }

  it('passes a complete form', () => expect(validateCheckout(ok)).toEqual({}))

  it('reports each missing field with a clear message', () => {
    const e = validateCheckout({ name: ' ', phone: '', zone: '', address: '', notes: '' })
    expect(Object.keys(e).sort()).toEqual(['address', 'name', 'phone', 'zone'])
    expect(e.phone).toMatch(/mobile number/)
  })

  it('rejects bad phones, short addresses and long notes', () => {
    const e = validateCheckout({ ...ok, phone: '12345', address: 'Dhaka', notes: 'x'.repeat(301) })
    expect(e.phone).toMatch(/01712345678/)
    expect(e.address).toMatch(/more detail/)
    expect(e.notes).toMatch(/300/)
  })
})
