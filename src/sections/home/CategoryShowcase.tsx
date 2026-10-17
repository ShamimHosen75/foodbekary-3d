import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Reveal, RevealGroup, RevealItem } from '../../components/motion/Reveal'
import { Container, SectionHeading } from '../../components/ui'
import { categories, type CategorySlug } from '../../data/categories'
import { CategoryCard } from './CategoryCard'

const FILTER_TABS: { id: 'all' | CategorySlug; label: string; icon: string }[] = [
  { id: 'all', label: 'All 4 Trays', icon: '✨' },
  { id: 'cakes', label: 'Cakes', icon: '🎂' },
  { id: 'cookies', label: 'Cookies', icon: '🍪' },
  { id: 'macarons', label: 'Macarons', icon: '🌸' },
  { id: 'pastries', label: 'Pastries', icon: '🍰' },
]

export function CategoryShowcase() {
  const [activeFilter, setActiveFilter] = useState<'all' | CategorySlug>('all')

  const filteredCategories =
    activeFilter === 'all' ? categories : categories.filter((c) => c.slug === activeFilter)

  return (
    <section aria-labelledby="showcase-title" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-accent/8 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-sand blur-[100px]" />

      <Container size="content" className="max-w-[76rem]">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            {/* Live Oven Batch pill */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-strong" />
              </span>
              <span>Stone Deck Ovens • Small batches baked fresh each morning</span>
            </div>

            <SectionHeading
              id="showcase-title"
              eyebrow="From our ovens"
              title="Four trays, baked daily."
              intro="Everything is made on site in small batches each morning. Pick a tray to see what’s on it today."
            />

            {/* Interactive Filter Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'bg-surface/80 text-ink/80 hover:bg-surface hover:text-ink border border-line'
                    }`}
                  >
                    {isActive && (
                      <m.span
                        layoutId="activeFilterPill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{tab.icon}</span>
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* 4-column balanced grid */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeFilter}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-12"
          >
            <RevealGroup
              as="ul"
              className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
                activeFilter === 'all'
                  ? 'lg:grid-cols-4'
                  : filteredCategories.length === 1
                  ? 'max-w-md mx-auto grid-cols-1'
                  : 'lg:grid-cols-3'
              }`}
            >
              {filteredCategories.map((c) => (
                <RevealItem as="li" key={c.slug} className="h-full">
                  <CategoryCard category={c} />
                </RevealItem>
              ))}
            </RevealGroup>
          </m.div>
        </AnimatePresence>
      </Container>
    </section>
  )
}
