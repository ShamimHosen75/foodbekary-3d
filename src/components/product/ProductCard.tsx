import { useState } from 'react'
import { m, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { useAddToCart } from '../../hooks/useAddToCart'
import { cn } from '../../lib/cn'
import { isLowStock, isSoldOut } from '../../lib/pricing'
import { useUiStore } from '../../store/uiStore'
import { Badge, Button, SmartImage } from '../ui'
import { FavoriteButton } from './FavoriteButton'
import { PriceTag } from './PriceTag'

/** `priority` = above the fold: load eagerly (first card also gets high fetch priority) for a fast LCP. */
export function ProductCard({ product, priority = 0 }: { product: Product; priority?: 0 | 1 | 2 }) {
  const addToCart = useAddToCart()
  const openQuickView = useUiStore((s) => s.openQuickView)
  const soldOut = isSoldOut(product)
  const [justAdded, setJustAdded] = useState(false)

  // 3-D interactive tilt tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 280, damping: 25 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 280, damping: 25 })

  // Shimmer reflection position
  const shimmerX = useMotionValue(-100)
  const shimmerY = useMotionValue(-100)
  const shimmerBg = useMotionTemplate`radial-gradient(280px circle at ${shimmerX}px ${shimmerY}px, rgba(255,255,255,0.4), transparent 70%)`

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const hw = rect.width / 2
    const hh = rect.height / 2
    mouseX.set(cx)
    mouseY.set(cy)
    rotateX.set(((cy - hh) / hh) * -8)
    rotateY.set(((cx - hw) / hw) * 8)
    shimmerX.set(cx)
    shimmerY.set(cy)
  }

  function handleLeave() {
    rotateX.set(0)
    rotateY.set(0)
    shimmerX.set(-100)
    shimmerY.set(-100)
  }

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (soldOut) return
    addToCart(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
  }

  return (
    <m.article
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      whileHover={{ y: -6 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 900,
      }}
      className="group/card relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all duration-300 ease-out-soft hover:border-accent hover:shadow-[0_20px_40px_-15px_rgba(44,35,26,0.22)]"
    >
      {/* Specular light shimmer */}
      <m.div
        className="pointer-events-none absolute inset-0 z-20 rounded-card opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{ background: shimmerBg }}
      />

      <div className="relative aspect-[5/3] overflow-hidden bg-sand" style={{ transformStyle: 'preserve-3d' }}>
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          aria-label={`Quick view: ${product.name}`}
          className="group/qv absolute inset-0 block h-full w-full cursor-pointer text-left"
        >
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            width={640}
            height={480}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority === 2 ? 'high' : 'auto'}
            decoding="async"
            wrapperClassName="h-full w-full"
            className={cn(
              'h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover/card:scale-108',
              soldOut && 'grayscale-[60%]',
            )}
          />
          {/* Quick view button backdrop */}
          <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors duration-300 group-hover/qv:bg-ink/20 group-focus-visible/qv:bg-ink/20">
            <span
              style={{ transform: 'translateZ(25px)' }}
              className="translate-y-2 rounded-full border border-white/60 bg-surface/95 px-4 py-2 text-xs font-semibold text-ink opacity-0 shadow-float backdrop-blur-md transition-all duration-300 group-hover/qv:translate-y-0 group-hover/qv:opacity-100 group-focus-visible/qv:translate-y-0 group-focus-visible/qv:opacity-100 hover:scale-105"
            >
              🔍 Quick View
            </span>
          </span>
        </button>

        <div
          className="pointer-events-none absolute top-3 right-3 left-3 z-10 flex items-start justify-between gap-2"
          style={{ transform: 'translateZ(20px)' }}
        >
          <div>
            {soldOut ? (
              <Badge variant="neutral" className="bg-surface/90 shadow-sm">
                Sold out
              </Badge>
            ) : (
              product.badge && (
                <Badge className="shadow-sm transition-transform duration-300 group-hover/card:scale-105">
                  {product.badge}
                </Badge>
              )
            )}
          </div>
          <FavoriteButton productId={product.id} name={product.name} className="pointer-events-auto" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5" style={{ transform: 'translateZ(10px)' }}>
        <h3 className="font-display text-lg leading-snug font-bold text-ink">
          <Link
            to={`/product/${product.slug}`}
            className="transition-colors hover:text-accent-ink group-hover/card:text-accent-ink"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>
        {isLowStock(product) && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-ink">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            Only {product.stock} left today
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <PriceTag product={product} className="text-sm font-bold" />
          <Button
            size="sm"
            variant={justAdded ? 'primary' : 'accent'}
            disabled={soldOut}
            onClick={handleAdd}
            aria-label={soldOut ? `Sold out: ${product.name}` : `Add to Cart: ${product.name}`}
            className={cn(
              'transition-all duration-300 active:scale-95',
              justAdded && 'bg-emerald-600 text-white hover:bg-emerald-700',
            )}
          >
            {soldOut ? 'Sold out' : justAdded ? '✓ Added!' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </m.article>
  )
}
