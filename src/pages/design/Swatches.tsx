const swatches = [
  { name: 'cream', className: 'bg-cream', hex: '#F2EEE4', role: 'Page background' },
  { name: 'cream-soft', className: 'bg-cream-soft', hex: '#F7F2ED', role: 'Alt section' },
  { name: 'sand', className: 'bg-sand', hex: '#F3EEE4', role: 'Modal / drawer' },
  { name: 'surface', className: 'bg-surface', hex: '#FFFFFF', role: 'Cards, inputs' },
  { name: 'ink', className: 'bg-ink', hex: '#2C231A', role: 'Text, dark CTA' },
  { name: 'muted', className: 'bg-muted', hex: '#6B5E54', role: 'Body copy' },
  { name: 'accent', className: 'bg-accent', hex: '#E08D6E', role: 'Decorative' },
  { name: 'accent-strong', className: 'bg-accent-strong', hex: '#B4532F', role: 'Accent CTA' },
  { name: 'accent-ink', className: 'bg-accent-ink', hex: '#A84E2C', role: 'Accent text' },
  { name: 'accent-tint', className: 'bg-accent-tint', hex: '#FBE6DD', role: 'Soft badge' },
  { name: 'gold', className: 'bg-gold', hex: '#BB9F61', role: 'Stars, subscribe' },
  { name: 'forest', className: 'bg-forest', hex: '#2E3932', role: 'Footer' },
] as const

export function Swatches() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Colour tokens">
      {swatches.map((s) => (
        <li key={s.name} className="overflow-hidden rounded-xl border border-line bg-surface" data-token={s.name}>
          <div className={`h-16 ${s.className}`} />
          <div className="px-3 py-2 text-xs">
            <p className="font-semibold">{s.name}</p>
            <p className="text-muted">
              {s.hex} · {s.role}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
