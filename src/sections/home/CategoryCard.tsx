import { m, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Badge, buttonClasses, SmartImage } from '../../components/ui'
import { categoryPath, type Category, type CategorySlug } from '../../data/categories'
import { getCategoryStats } from '../../data/categoryStats'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'

interface ConfectionDetail {
  icon: string
  label: string
  x: string
  y: string
  delay: number
}

const CATEGORY_EXTRAS: Record<
  CategorySlug,
  {
    glow: string
    hoverBorder: string
    accentBadge: string
    confections: ConfectionDetail[]
  }
> = {
  cakes: {
    glow: 'rgba(224, 141, 110, 0.28)',
    hoverBorder: 'hover:border-[#e08d6e]',
    accentBadge: 'Fresh baked',
    confections: [
      { icon: '🍓', label: 'Wild Strawberry', x: '10%', y: '16%', delay: 0 },
      { icon: '✨', label: 'Gold Sparkle', x: '82%', y: '24%', delay: 0.8 },
      { icon: '🎂', label: 'Celebration Cake', x: '76%', y: '68%', delay: 1.6 },
    ],
  },
  cookies: {
    glow: 'rgba(187, 159, 97, 0.32)',
    hoverBorder: 'hover:border-[#bb9f61]',
    accentBadge: 'Oven warm',
    confections: [
      { icon: '🍫', label: 'Chocolate Chunk', x: '12%', y: '18%', delay: 0.3 },
      { icon: '🍪', label: 'Hazelnut Cookie', x: '80%', y: '22%', delay: 1.1 },
      { icon: '✨', label: 'Gold Sparkle', x: '74%', y: '70%', delay: 1.7 },
    ],
  },
  macarons: {
    glow: 'rgba(217, 152, 166, 0.32)',
    hoverBorder: 'hover:border-[#d998a6]',
    accentBadge: 'Gift boxed',
    confections: [
      { icon: '🌸', label: 'Rose Water', x: '12%', y: '16%', delay: 0.2 },
      { icon: '✨', label: 'Gold Sparkle', x: '82%', y: '22%', delay: 0.9 },
      { icon: '🌿', label: 'Bronte Pistachio', x: '76%', y: '68%', delay: 1.8 },
    ],
  },
  pastries: {
    glow: 'rgba(212, 106, 106, 0.3)',
    hoverBorder: 'hover:border-[#d46a6a]',
    accentBadge: 'By the slice',
    confections: [
      { icon: '🍰', label: 'Cream Pastry', x: '12%', y: '18%', delay: 0.4 },
      { icon: '🍒', label: 'Sweet Cherry', x: '80%', y: '20%', delay: 1.2 },
      { icon: '✨', label: 'Gold Sparkle', x: '75%', y: '68%', delay: 1.9 },
    ],
  },
}

/** Whole card is clickable via a stretched link on the CTA (one tab stop per card). */
export function CategoryCard({ category }: { category: Category }) {
  const { count, fromPrice } = getCategoryStats(category.slug)
  const extras = CATEGORY_EXTRAS[category.slug] || CATEGORY_EXTRAS.cakes

  // 3-D tilt tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 })

  // Shimmer gradient position
  const shimmerX = useMotionValue(-100)
  const shimmerY = useMotionValue(-100)
  const shimmerBg = useMotionTemplate`radial-gradient(320px circle at ${shimmerX}px ${shimmerY}px, rgba(255,255,255,0.45), transparent 70%)`

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const hw = rect.width / 2
    const hh = rect.height / 2
    mouseX.set(cx)
    mouseY.set(cy)
    rotateX.set(((cy - hh) / hh) * -10)
    rotateY.set(((cx - hw) / hw) * 10)
    shimmerX.set(cx)
    shimmerY.set(cy)
  }

  function handleLeave() {
    rotateX.set(0)
    rotateY.set(0)
    shimmerX.set(-100)
    shimmerY.set(-100)
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
      className={cn(
        'group/card relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all duration-300 ease-out-soft',
        extras.hoverBorder,
        'hover:shadow-[0_22px_44px_-16px_rgba(44,35,26,0.24)]',
      )}
    >
      {/* Specular gloss shimmer overlay */}
      <m.div
        className="pointer-events-none absolute inset-0 z-20 rounded-card opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{ background: shimmerBg }}
      />

      {/* Ambient background glow ring */}
      <div
        className="pointer-events-none absolute -inset-px rounded-card opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          boxShadow: `0 0 32px 2px ${extras.glow}`,
        }}
      />

      <div className="relative aspect-[5/3] overflow-hidden bg-sand" style={{ transformStyle: 'preserve-3d' }}>
        <SmartImage
          src={category.image}
          alt={category.name}
          width={640}
          height={384}
          loading="lazy"
          decoding="async"
          wrapperClassName="h-full w-full"
          className="h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover/card:scale-110"
        />

        {/* Floating 3D confectionery accents */}
        <div className="pointer-events-none absolute inset-0 z-10" style={{ transformStyle: 'preserve-3d' }}>
          {extras.confections.map((item, idx) => (
            <m.span
              key={idx}
              aria-label={item.label}
              className="absolute select-none text-lg drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)]"
              style={{
                left: item.x,
                top: item.y,
                transform: 'translateZ(35px)',
              }}
              animate={{
                y: [0, -6, 0],
                rotate: [0, idx % 2 === 0 ? 8 : -8, 0],
              }}
              transition={{
                duration: 3 + idx * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: item.delay,
              }}
            >
              {item.icon}
            </m.span>
          ))}
        </div>

        {/* Ambient bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />

        {/* Top badges: Live bakery status + item count */}
        <div
          className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between"
          style={{ transform: 'translateZ(25px)' }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover/card:scale-105">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {extras.accentBadge}
          </span>
          <Badge className="shadow-sm transition-transform duration-300 group-hover/card:scale-105">
            {count} items
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5" style={{ transform: 'translateZ(15px)' }}>
        <h3 className="font-display text-xl font-bold tracking-tight text-ink transition-colors duration-200 group-hover/card:text-accent-ink">
          {category.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted line-clamp-2">{category.blurb}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-sm font-bold whitespace-nowrap text-ink">
            <span className="font-medium text-muted">From </span>
            {formatPrice(fromPrice)}
          </p>
          <Link
            to={categoryPath(category.slug)}
            className={cn(
              buttonClasses('accent', 'sm'),
              'group/btn relative transition-all duration-300 group-hover/card:bg-ink group-hover/card:shadow-md after:absolute after:inset-0 after:content-[""]',
            )}
          >
            <span>Explore {category.name}</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-out-soft group-hover/card:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </m.article>
  )
}
