import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import type { HeroScene } from '../../data/heroScenes'
import { FADE, SCENE_SPAN, sceneStart } from './heroTimeline'

interface LayerProps {
  scene: HeroScene
  index: number
  count: number
  progress: MotionValue<number>
  reduceMotion: boolean
}

/** One photo layer: fades in over the previous scene, then slowly pushes in (a "dolly"). */
function SceneLayer({ scene, index, count, progress, reduceMotion }: LayerProps) {
  const start = sceneStart(index, count)
  const end = sceneStart(index + 1, count)
  const opacity = useTransform(progress, index === 0 ? [0, 1] : [start - FADE, start + FADE], index === 0 ? [1, 1] : [0, 1])
  const scale = useTransform(progress, [Math.max(0, start - FADE), end + FADE], reduceMotion ? [1, 1] : [1.04, 1.2])
  const y = useTransform(progress, [Math.max(0, start - FADE), end + FADE], reduceMotion ? ['0%', '0%'] : ['0%', '-3%'])

  return (
    <motion.img
      src={scene.image.src}
      srcSet={scene.image.srcSet}
      sizes="100vw"
      alt=""
      aria-hidden="true"
      decoding="async"
      fetchPriority={index === 0 ? 'high' : 'low'}
      loading={index === 0 ? 'eager' : 'lazy'}
      style={{ opacity, scale, y }}
      className="absolute inset-0 h-full w-full object-cover will-change-transform"
    />
  )
}

/** Scroll-scrubbed footage — used instead of photos when `heroVideo` is configured. */
function ScrubVideo({ src, poster, progress }: { src: string; poster?: string; progress: MotionValue<number> }) {
  const ref = useRef<HTMLVideoElement>(null)
  useMotionValueEvent(progress, 'change', (p) => {
    const v = ref.current
    if (!v || !Number.isFinite(v.duration)) return
    v.currentTime = Math.min(1, p / SCENE_SPAN) * (v.duration - 0.05)
  })
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

export interface HeroBackdropProps {
  scenes: HeroScene[]
  progress: MotionValue<number>
  reduceMotion: boolean
  video: { src: string; poster?: string } | null
}

export function HeroBackdrop({ scenes, progress, reduceMotion, video }: HeroBackdropProps) {
  const outro = useTransform(progress, [SCENE_SPAN - 0.02, 0.99], [0, 1])
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {video ? (
        <ScrubVideo src={video.src} poster={video.poster} progress={progress} />
      ) : (
        scenes.map((s, i) => (
          <SceneLayer key={s.id} scene={s} index={i} count={scenes.length} progress={progress} reduceMotion={reduceMotion} />
        ))
      )}
      {/* Cream wash keeps the copy legible: from the left on desktop, from the bottom on mobile. */}
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/75 to-transparent to-70% md:bg-gradient-to-r md:via-cream/55 md:to-55%" />
      <motion.div style={{ opacity: outro }} className="absolute inset-0 bg-cream" />
    </div>
  )
}
