import { motion, useReducedMotion } from 'framer-motion'
import { useFavoritesStore } from '../../store/favoritesStore'
import { useToastStore } from '../../store/toastStore'
import { cn } from '../../lib/cn'

export function FavoriteButton({ productId, name, className }: { productId: string; name: string; className?: string }) {
  const saved = useFavoritesStore((s) => s.ids.includes(productId))
  const toggle = useFavoritesStore((s) => s.toggle)
  const toast = useToastStore((s) => s.push)
  const reduce = useReducedMotion()
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      onClick={(e) => {
        e.stopPropagation()
        toggle(productId)
        toast(saved ? `Removed “${name}” from favourites` : `Saved “${name}” to favourites`, saved ? '🤍' : '❤️')
      }}
      className={cn(
        'relative z-10 grid size-8 cursor-pointer place-items-center rounded-full bg-surface/90 text-sm shadow-card backdrop-blur-sm transition-transform hover:scale-110 active:scale-95',
        className,
      )}
    >
      <motion.span
        key={String(saved)}
        aria-hidden="true"
        initial={reduce ? false : { scale: saved ? 0.4 : 1.2 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 12 }}
      >
        {saved ? '❤️' : '🤍'}
      </motion.span>
    </button>
  )
}
