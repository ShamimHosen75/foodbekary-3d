/** Hour (0–23) in Asia/Dhaka for a given instant, independent of the viewer's timezone. */
export function dhakaHour(date: Date): number {
  const hour = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    hourCycle: 'h23',
    timeZone: 'Asia/Dhaka',
  }).format(date)
  return Number(hour)
}

export function isOpenAt(date: Date, openHour: number, closeHour: number): boolean {
  const h = dhakaHour(date)
  return h >= openHour && h < closeHour
}
