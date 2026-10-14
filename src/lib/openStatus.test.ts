import { dhakaHour, isOpenAt } from './openStatus'

describe('open status (Asia/Dhaka, UTC+6)', () => {
  it('converts UTC to Dhaka time', () => {
    expect(dhakaHour(new Date('2026-01-01T02:00:00Z'))).toBe(8)
  })

  it('is open from the opening hour up to (not including) closing', () => {
    expect(isOpenAt(new Date('2026-01-01T01:59:00Z'), 8, 22)).toBe(false) // 07:59
    expect(isOpenAt(new Date('2026-01-01T02:00:00Z'), 8, 22)).toBe(true) // 08:00
    expect(isOpenAt(new Date('2026-01-01T15:59:00Z'), 8, 22)).toBe(true) // 21:59
    expect(isOpenAt(new Date('2026-01-01T16:00:00Z'), 8, 22)).toBe(false) // 22:00
  })
})
