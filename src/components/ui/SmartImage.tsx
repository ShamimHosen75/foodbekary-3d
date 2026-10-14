import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { hydration } from '../../lib/hydration'

export interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Classes for the wrapper that shows the shimmer while loading. */
  wrapperClassName?: string
}

/**
 * Image with a shimmer placeholder that fades the picture in once decoded.
 * Cached images (already complete on mount) skip the fade so nothing flickers.
 */
export function SmartImage({ wrapperClassName, className, onLoad, alt, ...props }: SmartImageProps) {
  // Prerendered images show immediately (no JS needed); later ones get the shimmer + fade.
  const [loaded, setLoaded] = useState(hydration.active)
  return (
    <span className={cn('block overflow-hidden', !loaded && 'skeleton', wrapperClassName)} data-loaded={loaded || undefined}>
      <img
        {...props}
        alt={alt}
        ref={(el) => {
          if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true)
        }}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        className={cn('transition-opacity duration-500 ease-out-soft', loaded ? 'opacity-100' : 'opacity-0', className)}
      />
    </span>
  )
}
