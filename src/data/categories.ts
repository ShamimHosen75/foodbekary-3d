export type CategorySlug = 'cakes' | 'cookies' | 'macarons' | 'pastries'

export interface Category {
  slug: CategorySlug
  /** Short label for tabs and menus. */
  name: string
  emoji: string
  /** Longer label used in the footer and menu panel. */
  label: string
  eyebrow: string
  title: string
  intro: string
}

/** Copy is ours — structure mirrors the reference (REFERENCE_ANALYSIS.md §4). */
export const categories: readonly Category[] = [
  {
    slug: 'cakes',
    name: 'Cakes',
    emoji: '🎂',
    label: 'Celebration Cakes',
    eyebrow: 'Made to be shared',
    title: 'Celebration Cakes',
    intro: 'Layered sponges, real cream and slow-melted chocolate — for birthdays, weddings or a quiet Tuesday.',
  },
  {
    slug: 'cookies',
    name: 'Cookies',
    emoji: '🍪',
    label: 'Fresh-baked Cookies',
    eyebrow: 'Still warm',
    title: 'The Cookie Jar',
    intro: 'Crisp edges, soft middles and generous chunks. Baked in small trays through the day.',
  },
  {
    slug: 'macarons',
    name: 'Macarons',
    emoji: '🌸',
    label: 'French Macarons',
    eyebrow: 'Piped by hand',
    title: 'The Macaron Bar',
    intro: 'Almond shells with silky ganache and fruit curd fillings, sold singly or boxed as gifts.',
  },
  {
    slug: 'pastries',
    name: 'Pastries',
    emoji: '🍰',
    label: 'Cream Pastries',
    eyebrow: 'By the slice',
    title: 'Cream Pastries',
    intro: 'Individual slices of fudge, red velvet and fresh fruit cream, ready for the counter by 9 AM.',
  },
]

export function getCategory(slug: string | undefined): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export const categoryPath = (slug: CategorySlug) => `/menu/${slug}`
