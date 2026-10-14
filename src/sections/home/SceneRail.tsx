import { cn } from '../../lib/cn'

export interface SceneRailProps {
  labels: string[]
  active: number
  onSelect: (index: number) => void
}

/** Vertical scene indicator on the right edge; each dot jumps to its scene. */
export function SceneRail({ labels, active, onSelect }: SceneRailProps) {
  return (
    <nav aria-label="Story scenes" className="absolute top-1/2 right-4 hidden -translate-y-1/2 md:block lg:right-8">
      <ol className="flex flex-col items-end gap-4">
        {labels.map((label, i) => {
          const current = i === active
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={current ? 'step' : undefined}
                aria-label={`Scene ${i + 1}: ${label}`}
                className="group flex cursor-pointer items-center gap-3"
              >
                <span
                  className={cn(
                    'rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink shadow-card transition-all duration-300',
                    current ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-90',
                  )}
                >
                  {label}
                </span>
                <span
                  className={cn(
                    'block rounded-full border-2 transition-all duration-300',
                    current ? 'size-3 border-accent bg-accent' : 'size-2.5 border-surface/90 bg-surface/40',
                  )}
                />
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
