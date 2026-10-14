import { formatPrice } from './format'

describe('formatPrice', () => {
  it('formats taka with a thousands separator', () => {
    expect(formatPrice(2400)).toBe('৳ 2,400')
    expect(formatPrice(10750)).toBe('৳ 10,750')
  })

  it('uses the South Asian grouping for lakhs', () => {
    expect(formatPrice(125000)).toBe('৳ 1,25,000')
  })

  it('rounds fractional amounts', () => {
    expect(formatPrice(219.6)).toBe('৳ 220')
  })
})
