import { AnimatePresence, m } from 'framer-motion'
import { Link } from 'react-router-dom'
import { categoryPath } from '../../data/categories'
import type { HeroScene } from '../../data/heroScenes'
import { site } from '../../data/site'
import { buttonClasses, Tag } from '../../components/ui'

const pad = (n: number) => String(n).padStart(2, '0')

export interface HeroCopyProps {
  scenes: HeroScene[]
  active: number
  reduceMotion: boolean
}

/** Left-hand copy block; swaps with a blur/slide as the active scene changes. */
export function HeroCopy({ scenes, active, reduceMotion }: HeroCopyProps) {
  const scene = scenes[active]
  if (!scene) return null
  const isLast = active === scenes.length - 1
  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(6px)' }
  const shown = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }

  return (
    <div className="relative min-h-[19rem] w-full max-w-[25rem] sm:min-h-[21rem]" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={scene.id}
          initial={hidden}
          animate={shown}
          exit={{ ...hidden, y: reduceMotion ? 0 : -12, transition: { duration: 0.22 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 flex flex-col gap-3.5"
        >
          <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-muted">
            {pad(active + 1)} / {pad(scenes.length)}
          </p>
          <p className="text-eyebrow font-semibold text-accent-ink uppercase">{scene.eyebrow}</p>
          <h2 className="font-sans text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.025em] text-ink sm:text-[2.75rem]">
            {scene.title}
          </h2>
          <p className="text-[0.9375rem] leading-relaxed text-ink/80">{scene.body}</p>
          <ul className="flex flex-wrap gap-2" aria-label="Highlights">
            {scene.chips.map((c) => (
              <li key={c}>
                <Tag className="bg-surface/85 backdrop-blur-sm">{c}</Tag>
              </li>
            ))}
          </ul>
          {isLast && (
            <div className="mt-2 flex flex-wrap gap-3">
              <Link to={categoryPath('cakes')} className={buttonClasses('primary', 'lg')}>
                Explore the menu
              </Link>
              <a
                href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(`Hi ${site.name}! I'd like to order ahead.`)}`}
                target="_blank"
                rel="noreferrer"
                className={buttonClasses('outline', 'lg')}
              >
                Order ahead
              </a>
            </div>
          )}
        </m.div>
      </AnimatePresence>
    </div>
  )
}
