import { useState } from 'react'
import { cn } from '../../lib/cn'

export function ProductGallery({ images, name, className }: { images: string[]; name: string; className?: string }) {
  const [index, setIndex] = useState(0)
  const current = images[index] ?? images[0]
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="overflow-hidden rounded-2xl bg-surface">
        <img src={current} alt={`${name}, photo ${index + 1} of ${images.length}`} width={640} height={480} className="aspect-[4/3] w-full object-cover" />
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
                'size-16 cursor-pointer overflow-hidden rounded-xl border-2 transition-colors',
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
