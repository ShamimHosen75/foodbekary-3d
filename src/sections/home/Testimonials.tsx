import { useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { Reveal } from '../../components/motion/Reveal'
import { Badge, Container, SectionHeading, Stars } from '../../components/ui'
import { site } from '../../data/site'
import { testimonials } from '../../data/testimonials'

// Duplicate for seamless loop
const loopItems = [...testimonials, ...testimonials, ...testimonials]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

const AVATAR_COLORS = [
  'bg-amber-100 text-amber-900 border-amber-300',
  'bg-orange-100 text-orange-900 border-orange-300',
  'bg-rose-100 text-rose-900 border-rose-300',
  'bg-emerald-100 text-emerald-900 border-emerald-300',
]

function TestimonialCard({ t, index }: { t: (typeof testimonials)[number]; index: number }) {
  const avatarStyle = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const initials = getInitials(t.name)

  return (
    <m.figure
      whileHover={{ y: -8, boxShadow: '0 22px 45px -12px rgba(44,35,26,0.22)' }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full min-w-[19rem] max-w-[23rem] flex-col justify-between rounded-card border border-line bg-surface p-6 shadow-card transition-colors duration-300 hover:border-accent"
    >
      {/* Decorative quote mark */}
      <span
        aria-hidden="true"
        className="absolute top-4 right-5 font-display text-6xl leading-none text-accent/15 transition-all duration-300 group-hover:text-accent/35 select-none"
      >
        “
      </span>

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Stars rating={t.rating} />
          <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Verified Order
          </span>
        </div>

        <blockquote className="relative z-10 text-[0.9375rem] leading-relaxed text-ink/90 italic">
          "{t.quote}"
        </blockquote>
      </div>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold shadow-xs ${avatarStyle}`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <span className="block font-display text-sm font-bold text-ink truncate">{t.name}</span>
          <span className="block text-xs text-muted truncate">📍 {t.area}</span>
        </div>
        <Badge variant="soft" className="shrink-0 text-[0.6875rem] leading-tight">
          {t.product}
        </Badge>
      </figcaption>
    </m.figure>
  )
}

const TRUST_STATS = [
  { value: '4.95 / 5', label: 'Average rating from 3,400+ orders in Dhaka', icon: '⭐️' },
  { value: '100% Real', label: 'Pure Normandy butter & Belgian chocolate', icon: '🧈' },
  { value: '4 Hour Batches', label: 'Baked fresh in small trays through the day', icon: '🥐' },
  { value: 'Chilled Boxed', label: 'Temperature-safe delivery across Dhaka', icon: '📦' },
]

export function Testimonials() {
  const reduceMotion = useReducedMotion()
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section aria-labelledby="reviews-title" className="overflow-hidden border-t border-line bg-cream-soft py-20 sm:py-28">
      <Container size="content" className="max-w-[76rem]">
        <Reveal>
          <div className="text-center">
            <SectionHeading
              id="reviews-title"
              eyebrow="Kind words"
              title={`Why Dhaka keeps coming back to ${site.name}.`}
              intro="A few notes from people who've shared our cakes at their celebrations, birthdays, and quiet tables."
            />
          </div>
        </Reveal>
      </Container>

      {/* Marquee strip — full bleed with pause on hover */}
      <div
        className="relative mt-12 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-cream-soft to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-cream-soft to-transparent" />

        <m.ul
          className="flex gap-6 pb-4"
          animate={
            reduceMotion
              ? {}
              : isPaused
              ? {}
              : { x: [0, -1 * (testimonials.length * 400)] }
          }
          transition={{
            duration: 32,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          style={{ width: 'max-content' }}
        >
          {loopItems.map((t, i) => (
            <li key={`${t.id}-${i}`} className="flex-shrink-0">
              <TestimonialCard t={t} index={i} />
            </li>
          ))}
        </m.ul>
      </div>

      {/* Trust & Craft Standards Banner */}
      <Container size="content" className="max-w-[76rem] mt-14">
        <Reveal>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface/80 p-6 sm:grid-cols-4 sm:p-8 shadow-card backdrop-blur-sm">
            {TRUST_STATS.map((stat, i) => (
              <div key={i} className="flex flex-col gap-1.5 border-line last:border-none sm:border-r sm:pr-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="font-display text-xl font-bold text-ink">{stat.value}</span>
                <span className="text-xs text-muted leading-relaxed">{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
