import cakesImg from '../assets/categories/cat-cakes-640.webp'
import cookiesImg from '../assets/categories/cat-cookies-640.webp'
import macaronsImg from '../assets/categories/cat-macarons-640.webp'
import pastriesImg from '../assets/categories/cat-pastries-640.webp'

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
  /** Two-to-three line pitch on the home page card. */
  blurb: string
  image: string
}

/** Copy is ours — structure mirrors the reference (REFERENCE_ANALYSIS.md §4). */
export const categories: readonly Category[] = [
  {
    slug: 'cakes',
    blurb: 'Whole cakes and slices — vanilla sponge, fresh fruit, and dark chocolate glazed to a mirror shine.',
    image: cakesImg,
    name: 'Cakes',
    emoji: '🎂',
    label: 'Celebration Cakes',
    eyebrow: 'Made to be shared',
    title: 'Celebration Cakes',
    intro: 'Layered sponges, real cream and slow-melted chocolate — for birthdays, weddings or a quiet Tuesday.',
  },
  {
    slug: 'cookies',
    blurb: 'Thick, chewy and loaded with chocolate. Some are stuffed, all of them are best eaten warm.',
    image: cookiesImg,
    name: 'Cookies',
    emoji: '🍪',
    label: 'Fresh-baked Cookies',
    eyebrow: 'Still warm',
    title: 'The Cookie Jar',
    intro: 'Crisp edges, soft middles and generous chunks. Baked in small trays through the day.',
  },
  {
    slug: 'macarons',
    blurb: 'Pistachio, raspberry, lemon and salted caramel. Crisp shells, soft centres, boxed by six or twelve.',
    image: macaronsImg,
    name: 'Macarons',
    emoji: '🌸',
    label: 'French Macarons',
    eyebrow: 'Piped by hand',
    title: 'The Macaron Bar',
    intro: 'Almond shells with silky ganache and fruit curd fillings, sold singly or boxed as gifts.',
  },
  {
    slug: 'pastries',
    blurb: 'Individual slices of fudge, red velvet and fresh fruit cream — the perfect afternoon treat.',
    image: pastriesImg,
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
