import type { CategorySlug } from './categories'

export interface Collection {
  id: string
  label: string
  emoji: string
}

/** Filter chips per category page (after the automatic "All" chip). */
export const collections: Record<CategorySlug, Collection[]> = {
  cakes: [
    { id: 'bestsellers', label: 'Bestsellers', emoji: '⭐' },
    { id: 'chocolate', label: 'Chocolate', emoji: '🍫' },
    { id: 'fruit', label: 'Berries & Fruit', emoji: '🍓' },
  ],
  cookies: [
    { id: 'bestsellers', label: 'Bestsellers', emoji: '⭐' },
    { id: 'stuffed', label: 'Stuffed', emoji: '🌰' },
    { id: 'boxes', label: 'Boxes & Platters', emoji: '🎁' },
  ],
  macarons: [
    { id: 'chef', label: 'Chef’s Picks', emoji: '⭐' },
    { id: 'gifts', label: 'Gift Sets', emoji: '🎁' },
    { id: 'singles', label: 'Singles', emoji: '🌸' },
  ],
  pastries: [
    { id: 'bestsellers', label: 'Bestsellers', emoji: '⭐' },
    { id: 'chocolate', label: 'Chocolate', emoji: '🍫' },
    { id: 'red-velvet', label: 'Red Velvet', emoji: '❤️' },
    { id: 'fruit', label: 'Fresh Fruit', emoji: '🍍' },
  ],
}
