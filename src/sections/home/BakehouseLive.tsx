import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Reveal } from '../../components/motion/Reveal'
import { Container } from '../../components/ui'
import { useToastStore } from '../../store/toastStore'

interface OvenBatch {
  id: string
  batchNumber: string
  time: string
  title: string
  category: string
  status: 'ready' | 'fresh' | 'baking' | 'prep'
  statusLabel: string
  progress: number
  bakerNote: string
  temperature: string
}

const OVEN_BATCHES: OvenBatch[] = [
  {
    id: 'batch-1',
    batchNumber: '01',
    time: '08:30 AM',
    title: 'Heritage Sourdough & Croissants',
    category: 'Breakfast Bake',
    status: 'ready',
    statusLabel: 'On Display Counter',
    progress: 100,
    bakerNote: 'Slow fermented for 36 hours. Crisp honeycomb crust with rich cultured butter aroma.',
    temperature: '240°C',
  },
  {
    id: 'batch-2',
    batchNumber: '02',
    time: '11:00 AM',
    title: 'Valrhona Chocolate Celebration Cakes',
    category: 'Celebration Sponges',
    status: 'fresh',
    statusLabel: 'Fresh Out! Steaming',
    progress: 100,
    bakerNote: 'Dark chocolate glaze applied at 32°C. Soft crumb infused with Madagascar vanilla.',
    temperature: '180°C',
  },
  {
    id: 'batch-3',
    batchNumber: '03',
    time: '02:30 PM',
    title: 'Brown Butter & Hazelnut Stuffed Cookies',
    category: 'Warm Afternoon Tray',
    status: 'baking',
    statusLabel: 'In Oven (11 mins left)',
    progress: 84,
    bakerNote: 'Topped with hand-crumbled Maldon sea salt flakes. Center is molten and gooey.',
    temperature: '195°C',
  },
  {
    id: 'batch-4',
    batchNumber: '04',
    time: '05:00 PM',
    title: 'French Macaron Shells & Fruit Tarts',
    category: 'Evening Delicacies',
    status: 'prep',
    statusLabel: 'Piping in Proofing Room',
    progress: 30,
    bakerNote: 'Almond flour triple-sifted for silk shells. Fruit curds simmering in copper pans.',
    temperature: '160°C',
  },
]

interface FlavorProfile {
  id: string
  name: string
  tagline: string
  emoji: string
  origin: string
  accentColor: string
  bgTint: string
  categorySlug: string
  categoryName: string
  sensory: {
    sweetness: number
    aroma: number
    crunch: number
    melt: number
  }
  notes: string[]
  drinkPairing: string
  chefQuote: string
}

const FLAVOR_PROFILES: FlavorProfile[] = [
  {
    id: 'chocolate',
    name: '70% Valrhona Guanaja',
    tagline: 'Single-estate bittersweet dark chocolate with roasted cocoa beans',
    emoji: '🍫',
    origin: 'Madagascar & Ghana estate cacao',
    accentColor: '#8a4221',
    bgTint: 'bg-accent/15 border border-accent/25',
    categorySlug: 'cakes',
    categoryName: 'Celebration Cakes',
    sensory: {
      sweetness: 42,
      aroma: 95,
      crunch: 60,
      melt: 98,
    },
    notes: ['Roasted Espresso', 'Red Forest Berries', 'Smoked Oak Finish'],
    drinkPairing: 'Double Cortado or Single-Origin Ethiopian Pour-Over',
    chefQuote: 'We melt the cocoa buttons slowly at 45°C to preserve the floral volatile aromatics.',
  },
  {
    id: 'strawberry',
    name: 'Wild Sreemangal Strawberry',
    tagline: 'Sun-ripened hillside strawberries simmered with vanilla pod caviar',
    emoji: '🍓',
    origin: 'Sreemangal organic micro-orchards',
    accentColor: '#c43a49',
    bgTint: 'bg-rose-500/15 border border-rose-500/25',
    categorySlug: 'pastries',
    categoryName: 'Cream Pastries',
    sensory: {
      sweetness: 68,
      aroma: 98,
      crunch: 40,
      melt: 94,
    },
    notes: ['Alpine Sweetness', 'Sparkling Citric Tartness', 'Vanilla Bean Caviar'],
    drinkPairing: 'Iced Jasmine Pearl Tea or Sparkling Mineral Water',
    chefQuote: 'Picked before sunrise while the dewy coolness keeps the fruit perfume locked inside.',
  },
  {
    id: 'pistachio',
    name: 'Bronte Sicilian Pistachio',
    tagline: 'Slow-roasted emerald pistachios from the volcanic soils of Mount Etna',
    emoji: '🌿',
    origin: 'Bronte, Sicily (Protected Origin)',
    accentColor: '#5c7847',
    bgTint: 'bg-emerald-500/15 border border-emerald-500/25',
    categorySlug: 'macarons',
    categoryName: 'French Macarons',
    sensory: {
      sweetness: 54,
      aroma: 92,
      crunch: 75,
      melt: 88,
    },
    notes: ['Toasted Green Almond', 'Velvety Stone-Ground Paste', 'Earthy Floral Hint'],
    drinkPairing: 'Matcha Oat Latte or Darjeeling First Flush',
    chefQuote: 'Stone-milled for 14 hours until it flows like warm silk ganache.',
  },
  {
    id: 'sea-salt-caramel',
    name: 'Maldon Salted Brown Butter',
    tagline: 'Deep nutty beurre noisette blended with kettle caramelized raw cane sugar',
    emoji: '🍯',
    origin: 'Essex Sea Coast & Normandy Cultured Butter',
    accentColor: '#b4742a',
    bgTint: 'bg-amber-500/15 border border-amber-500/25',
    categorySlug: 'cookies',
    categoryName: 'Fresh-Baked Cookies',
    sensory: {
      sweetness: 72,
      aroma: 96,
      crunch: 88,
      melt: 90,
    },
    notes: ['Toasted Brioche', 'Mineral Flake Crunch', 'Warm Honeycomb'],
    drinkPairing: 'Spiced Cardamom Milk Tea or Flat White',
    chefQuote: 'We cook the butter past the foaming stage until the milk solids turn amber gold.',
  },
]

export function BakehouseLive() {
  const [activeBatchIndex, setActiveBatchIndex] = useState(2) // Batch 3 (In Oven) selected by default
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorProfile>(FLAVOR_PROFILES[0]!)
  const [activeMode, setActiveMode] = useState<'oven' | 'tasting'>('oven')
  const toast = useToastStore((s) => s.push)

  // Play a synthesized bakery counter bell ding using Web Audio API
  function playBakeryBell() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime

      // Bell chime fundamental + harmonic overtone
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(1480, now) // High brass ring
      osc1.frequency.exponentialRampToValueAtTime(1460, now + 1.2)

      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(2960, now) // Clear harmonic sparkle
      osc2.frequency.exponentialRampToValueAtTime(2920, now + 0.8)

      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 1.5)
      osc2.stop(now + 1.5)
    } catch {
      // AudioContext unavailable or restricted
    }
    toast('🔔 *Ding!* You’re on the priority alert list for the next warm cookie batch!', '✨')
  }

  const activeBatch = OVEN_BATCHES[activeBatchIndex] ?? OVEN_BATCHES[0]!

  return (
    <section
      aria-labelledby="live-section-title"
      className="relative overflow-hidden border-t border-line bg-cream py-20 sm:py-28"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 -left-32 h-80 w-80 rounded-full bg-accent/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-[#bb9f61]/10 blur-[110px]" />

      <Container size="content" className="max-w-[76rem]">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-1.5 font-mono text-xs font-semibold tracking-wider text-accent-ink uppercase shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Artisan Live Experience
            </span>

            <h2
              id="live-section-title"
              className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl"
            >
              The Warm Hearth & Tasting Atelier
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Follow our stone deck ovens in real time as fresh batches emerge throughout the day, or
              explore our signature single-origin flavor profiles.
            </p>

            {/* Mode Toggle Switcher */}
            <div className="mt-8 flex rounded-full border border-line bg-surface p-1 shadow-card">
              <button
                type="button"
                onClick={() => setActiveMode('oven')}
                className={`relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeMode === 'oven' ? 'text-white' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {activeMode === 'oven' && (
                  <m.span
                    layoutId="liveModeIndicator"
                    className="absolute inset-0 rounded-full bg-accent-strong shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">🔥 Live Oven Batches</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('tasting')}
                className={`relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeMode === 'tasting' ? 'text-white' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {activeMode === 'tasting' && (
                  <m.span
                    layoutId="liveModeIndicator"
                    className="absolute inset-0 rounded-full bg-accent-strong shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">✨ 3D Tasting Atelier</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Content Area */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            {activeMode === 'oven' ? (
              <m.div
                key="oven-view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start"
              >
                {/* Left column: 4 Daily Batches selector */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">
                      Today's 4 Oven Batches
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-mono text-[0.6875rem] font-bold text-emerald-800">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Deck #2 Active
                    </span>
                  </div>

                  {OVEN_BATCHES.map((batch, index) => {
                    const isSelected = activeBatchIndex === index
                    return (
                      <button
                        key={batch.id}
                        type="button"
                        onClick={() => setActiveBatchIndex(index)}
                        className={`group relative flex flex-col text-left rounded-xl border p-4.5 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-accent bg-surface shadow-lift -translate-y-0.5'
                            : 'border-line bg-surface/70 hover:bg-surface hover:border-line-hover shadow-card'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex size-6 items-center justify-center rounded-md font-mono text-xs font-bold ${
                                isSelected ? 'bg-accent text-white' : 'bg-sand text-ink'
                              }`}
                            >
                              {batch.batchNumber}
                            </span>
                            <span className="font-mono text-xs font-medium text-muted">
                              {batch.time}
                            </span>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              batch.status === 'fresh'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : batch.status === 'baking'
                                ? 'bg-orange-100 text-orange-900 border border-orange-300'
                                : batch.status === 'ready'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-sand text-muted border border-line'
                            }`}
                          >
                            {batch.status === 'baking' && (
                              <span className="size-1.5 rounded-full bg-orange-500 animate-ping" />
                            )}
                            {batch.status === 'fresh' && <span>♨️</span>}
                            {batch.statusLabel}
                          </span>
                        </div>

                        <h4 className="mt-2.5 font-display text-base font-bold text-ink group-hover:text-accent-ink transition-colors">
                          {batch.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted line-clamp-1">{batch.category}</p>

                        {/* Progress line */}
                        <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                          <m.div
                            className={`h-full rounded-full ${
                              batch.status === 'baking'
                                ? 'bg-gradient-to-r from-accent to-accent-strong'
                                : batch.status === 'ready'
                                ? 'bg-emerald-500'
                                : 'bg-accent'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${batch.progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Right column: Interactive Oven Monitor Display */}
                <div className="lg:col-span-7">
                  <div className="relative overflow-hidden rounded-2xl border border-[#322c24] bg-[#14120f] text-[#f7efe4] p-6 sm:p-8 shadow-float">
                    {/* Simulated stone hearth warm glow */}
                    <div className="pointer-events-none absolute -right-20 -bottom-20 size-72 rounded-full bg-accent/20 blur-[90px]" />
                    <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-[#bb9f61]/15 blur-[80px]" />

                    {/* Oven header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-xl">
                          🔥
                        </div>
                        <div>
                          <p className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
                            Stone Hearth Deck #2
                          </p>
                          <h3 className="font-display text-xl font-bold text-white">
                            Live Batch Monitoring
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white/10 px-3 py-1.5 text-right font-mono text-xs">
                          <span className="block text-white/60">Oven Hearth</span>
                          <span className="font-bold text-accent">{activeBatch.temperature}</span>
                        </div>
                        <div className="rounded-lg bg-white/10 px-3 py-1.5 text-right font-mono text-xs">
                          <span className="block text-white/60">Scheduled</span>
                          <span className="font-bold text-white">{activeBatch.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Batch inspection card */}
                    <div className="mt-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                            Batch {activeBatch.batchNumber} • {activeBatch.category}
                          </span>
                          <h4 className="mt-2 font-display text-2xl font-extrabold text-white">
                            {activeBatch.title}
                          </h4>
                        </div>
                        <span className="font-display text-4xl select-none opacity-20 font-black text-white">
                          {activeBatch.batchNumber}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed text-white/85">
                        {activeBatch.bakerNote}
                      </p>

                      {/* Animated Baking Chamber Gauge */}
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-xs font-mono text-white/70 mb-2">
                          <span>Baking Chamber Progress</span>
                          <span className="font-bold text-accent">{activeBatch.progress}% Done</span>
                        </div>
                        <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/10">
                          <m.div
                            className="h-full rounded-full bg-gradient-to-r from-accent via-[#e08d6e] to-[#bb9f61]"
                            animate={{
                              width: `${activeBatch.progress}%`,
                            }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[0.6875rem] font-mono text-white/60">
                          <span>Proofed & Scored</span>
                          <span>Oven Rise</span>
                          <span>Golden Crust</span>
                          <span>Counter Ready</span>
                        </div>
                      </div>

                      {/* Interactive Bell action */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                          </span>
                          <span className="text-xs text-white/80">
                            Want to grab this batch while steaming?
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={playBakeryBell}
                          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-ink shadow-md transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <span>🔔</span>
                          <span>Ring Bell When Hot</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            ) : (
              <m.div
                key="tasting-view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start"
              >
                {/* Left column: 4 Signature Flavor Notes */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="pb-2">
                    <span className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">
                      Select A Signature Flavor Note
                    </span>
                  </div>

                  {FLAVOR_PROFILES.map((flavor) => {
                    const isSelected = selectedFlavor.id === flavor.id
                    return (
                      <button
                        key={flavor.id}
                        type="button"
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`group relative flex items-center gap-4 text-left rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-accent bg-surface shadow-lift -translate-y-0.5'
                            : 'border-line bg-surface/70 hover:bg-surface shadow-card'
                        }`}
                      >
                        <div
                          className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110 ${flavor.bgTint}`}
                        >
                          {flavor.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-base font-bold text-ink group-hover:text-accent-ink transition-colors">
                            {flavor.name}
                          </h4>
                          <p className="text-xs text-muted truncate">{flavor.origin}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-accent">
                          {isSelected ? 'Active →' : ''}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Right column: 3D Flavor Sensory Radar & Pairing Card */}
                <div className="lg:col-span-7">
                  <m.div
                    key={selectedFlavor.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-card"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
                      <div>
                        <span className="font-mono text-xs font-semibold tracking-wider text-accent-ink uppercase">
                          {selectedFlavor.origin}
                        </span>
                        <h3 className="mt-1 font-display text-2xl font-bold text-ink">
                          {selectedFlavor.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted">{selectedFlavor.tagline}</p>
                      </div>
                      <div
                        className={`flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm ${selectedFlavor.bgTint}`}
                      >
                        {selectedFlavor.emoji}
                      </div>
                    </div>

                    {/* Sensory Profile Meters */}
                    <div className="mt-6">
                      <h4 className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">
                        Sensory Profile & Intensity
                      </h4>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Sweetness */}
                        <div className="rounded-xl border border-line bg-sand/50 p-3">
                          <div className="flex justify-between text-xs font-medium text-ink">
                            <span>Sweetness Balance</span>
                            <span className="font-mono font-bold">{selectedFlavor.sensory.sweetness}%</span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
                            <m.div
                              className="h-full rounded-full bg-accent"
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedFlavor.sensory.sweetness}%` }}
                              transition={{ duration: 0.7 }}
                            />
                          </div>
                        </div>

                        {/* Aroma & Bouquet */}
                        <div className="rounded-xl border border-line bg-sand/50 p-3">
                          <div className="flex justify-between text-xs font-medium text-ink">
                            <span>Aroma & Bouquet</span>
                            <span className="font-mono font-bold">{selectedFlavor.sensory.aroma}%</span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
                            <m.div
                              className="h-full rounded-full bg-[#bb9f61]"
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedFlavor.sensory.aroma}%` }}
                              transition={{ duration: 0.7 }}
                            />
                          </div>
                        </div>

                        {/* Crunch & Flake */}
                        <div className="rounded-xl border border-line bg-sand/50 p-3">
                          <div className="flex justify-between text-xs font-medium text-ink">
                            <span>Crunch & Texture</span>
                            <span className="font-mono font-bold">{selectedFlavor.sensory.crunch}%</span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
                            <m.div
                              className="h-full rounded-full bg-[#a0672a]"
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedFlavor.sensory.crunch}%` }}
                              transition={{ duration: 0.7 }}
                            />
                          </div>
                        </div>

                        {/* Melt & Silk */}
                        <div className="rounded-xl border border-line bg-sand/50 p-3">
                          <div className="flex justify-between text-xs font-medium text-ink">
                            <span>Silkiness & Melt</span>
                            <span className="font-mono font-bold">{selectedFlavor.sensory.melt}%</span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
                            <m.div
                              className="h-full rounded-full bg-accent-strong"
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedFlavor.sensory.melt}%` }}
                              transition={{ duration: 0.7 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tasting notes tags */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {selectedFlavor.notes.map((note) => (
                        <span
                          key={note}
                          className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink/80 shadow-xs"
                        >
                          ✦ {note}
                        </span>
                      ))}
                    </div>

                    {/* Drink pairing & Chef Quote */}
                    <div className="mt-5 rounded-xl border border-line bg-sand/30 p-4">
                      <p className="text-xs text-muted italic">"{selectedFlavor.chefQuote}"</p>
                      <div className="mt-3 flex items-center gap-2 border-t border-line/60 pt-3 text-xs font-medium text-ink">
                        <span>☕ Recommended Sip:</span>
                        <span className="text-accent-ink font-semibold">{selectedFlavor.drinkPairing}</span>
                      </div>
                    </div>

                    {/* Jump to Category */}
                    <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                      <span className="text-xs text-muted">
                        Featured in our <strong className="text-ink">{selectedFlavor.categoryName}</strong> tray
                      </span>
                      <Link
                        to={`/menu/${selectedFlavor.categorySlug}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent-strong px-5 py-2 text-xs font-bold text-white shadow-card transition-all duration-300 hover:bg-accent hover:text-ink hover:scale-105"
                      >
                        <span>Taste in Menu</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </m.div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}
