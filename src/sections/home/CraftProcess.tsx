import { m, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import mixImg from '../../assets/process-mix.jpg'
import bakeImg from '../../assets/process-bake.jpg'
import decorateImg from '../../assets/process-decorate.jpg'
import packImg from '../../assets/process-pack.jpg'
import { Reveal, RevealGroup, RevealItem } from '../../components/motion/Reveal'
import { Container } from '../../components/ui'

const steps = [
  {
    id: 'mix',
    step: '01',
    title: 'Mix by hand',
    body: 'Every dough starts with a wooden spoon and honest effort. No shortcuts, no machines for the critical bits.',
    img: mixImg,
    color: 'bg-surface hover:border-accent',
    accent: 'text-accent-ink',
  },
  {
    id: 'bake',
    step: '02',
    title: 'Slow bake',
    body: 'Stone deck ovens at low heat. The crust develops in its own time — never rushed, always right.',
    img: bakeImg,
    color: 'bg-surface hover:border-gold',
    accent: 'text-gold',
  },
  {
    id: 'decorate',
    step: '03',
    title: 'Hand-piped',
    body: 'Every swirl of cream, every drizzle of ganache is applied by a pastry chef — not extruded by a nozzle.',
    img: decorateImg,
    color: 'bg-surface hover:border-emerald-500/50',
    accent: 'text-emerald-400',
  },
  {
    id: 'pack',
    step: '04',
    title: 'Packed with care',
    body: 'Kraft boxes, terracotta ribbon, and a handwritten note. Because the unboxing is part of the gift.',
    img: packImg,
    color: 'bg-surface hover:border-accent',
    accent: 'text-accent',
  },
]

function ProcessStep({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.35'] })
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? '-30px' : '30px', '0px'])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <m.div
      ref={ref}
      style={{ x, opacity }}
      whileHover={{ y: -6 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line ${step.color} p-8 shadow-card transition-all duration-300 hover:shadow-lift`}
    >
      {/* Step number watermark */}
      <span
        aria-hidden="true"
        className="absolute top-4 right-6 font-display text-[6rem] font-black leading-none text-ink/5 select-none transition-transform duration-500 group-hover:scale-110"
      >
        {step.step}
      </span>

      <div>
        <div className="relative mb-6 h-36 w-36 overflow-hidden rounded-xl shadow-md">
          <m.img
            src={step.img}
            alt={step.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-110"
          />
        </div>

        <p className={`mb-1 font-mono text-xs font-semibold tracking-[0.2em] uppercase ${step.accent}`}>
          Step {step.step}
        </p>
        <h3 className="mb-2 font-display text-2xl font-bold text-ink">{step.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{step.body}</p>
      </div>

      {/* Animated underline */}
      <div className="mt-6 h-0.5 w-0 rounded-full bg-accent/60 transition-all duration-700 group-hover:w-full" />
    </m.div>
  )
}

export function CraftProcess() {
  return (
    <section
      aria-labelledby="process-title"
      className="relative overflow-hidden border-t border-line bg-cream py-20 sm:py-28"
    >
      {/* Decorative ambient background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
      />

      <Container size="content" className="max-w-[76rem]">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow mb-2 font-semibold tracking-[0.18em] text-accent-ink uppercase">
                Our craft & slow philosophy
              </p>
              <h2
                id="process-title"
                className="font-display text-[2.5rem] leading-[1.08] font-extrabold tracking-[-0.02em] text-ink sm:text-[3rem]"
              >
                Made the slow way.
                <br />
                <span className="text-accent-ink">Every single day.</span>
              </h2>
            </div>
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted">
              Four steps stand between raw ingredients and your table. We refuse to cut corners or skip any of them.
            </p>
          </div>
        </Reveal>

        <RevealGroup as="div" className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <RevealItem key={step.id} className="h-full">
              <ProcessStep step={step} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  )
}
