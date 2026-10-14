import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { SmartImage } from '../ui'

export function ProductGallery({ images, name, className }: { images: string[]; name: string; className?: string }) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const current = images[index] ?? images[0]
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
        {/* Photos crossfade (with a slight settle) when a thumbnail is chosen. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <SmartImage src={current} alt={`${name}, photo ${index + 1} of ${images.length}`} width={640} height={480} wrapperClassName="h-full w-full" className="h-full w-full object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div role="group" aria-label="Choose photo" className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === index}
              className={cn(
                'size-16 cursor-pointer overflow-hidden rounded-xl border-2 transition-[border-color,opacity] duration-200',
                i === index ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <img src={src} alt="" width={64} height={64} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
