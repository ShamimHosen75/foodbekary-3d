import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { heroScenes, heroVideo } from '../../data/heroScenes'
import { site } from '../../data/site'
import { HeroBackdrop } from './HeroBackdrop'
import { HeroCopy } from './HeroCopy'
import { SceneRail } from './SceneRail'
import { FADE, SCENE_SPAN, sceneAt, sceneStart } from './heroTimeline'

/**
 * Pinned, scroll-driven hero: scrolling moves the "camera" through the scenes
 * while the copy and rail follow (REFERENCE_ANALYSIS.md §3.1).
 */
export function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  const foreground = useTransform(scrollYProgress, [SCENE_SPAN, 0.97], [1, 0])
  const n = heroScenes.length

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = sceneAt(p, n)
    setActive((prev) => (prev === next ? prev : next))
  })

  const goTo = useCallback(
    (i: number) => {
      const el = sectionRef.current
      if (!el) return
      const scrollable = el.offsetHeight - window.innerHeight
      const top = el.getBoundingClientRect().top + window.scrollY
      const target = i === 0 ? 0 : sceneStart(i, n) + FADE
      window.scrollTo({ top: top + target * scrollable + 1, behavior: reduceMotion ? 'auto' : 'smooth' })
    },
    [n, reduceMotion],
  )

  return (
    <section ref={sectionRef} aria-label="Our story" className="relative h-[420svh] md:h-[440vh]">
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>
      <div className="sticky top-0 h-svh overflow-hidden">
        <HeroBackdrop scenes={heroScenes} progress={scrollYProgress} reduceMotion={reduceMotion} video={heroVideo} />
        <m.div style={{ opacity: foreground }} className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-[90rem] items-end px-4 pb-10 sm:px-6 md:items-center md:pb-0 lg:px-8">
            <div className="w-full max-w-[26rem] md:mt-24">
              <HeroCopy scenes={heroScenes} active={active} reduceMotion={reduceMotion} />
            </div>
          </div>
          <SceneRail labels={heroScenes.map((s) => s.label)} active={active} onSelect={goTo} />
        </m.div>
      </div>
    </section>
  )
}
