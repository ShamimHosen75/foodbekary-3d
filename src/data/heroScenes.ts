import shopfrontNew from '../assets/hero/scene-shopfront-new.jpg'
import counterImg from '../assets/hero/scene-counter.jpg'
import bakehouseIdle from '../assets/hero/scene-bakehouse-idle.jpg'
import bakehouseOpen from '../assets/hero/scene-bakehouse-open.jpg'
import terraceImg from '../assets/hero/scene-terrace.jpg'
import { site } from './site'

export interface HeroScene {
  id: string
  /** Label on the right-hand progress rail. */
  label: string
  eyebrow: string
  title: string
  body: string
  chips: string[]
  image: { src: string; srcSet: string }
}

const img = (src: string) => ({ src, srcSet: src + ' 1600w' })


export const heroScenes: HeroScene[] = [
  {
    id: 'shopfront',
    label: 'The Counter',
    eyebrow: 'Fresh out of the oven',
    title: 'Three things done right.',
    body: 'We keep the menu small so we can make everything properly. Whole cakes, cracked-top cookies, and delicate French macarons.',
    chips: ['Sponge & Cream', 'Nutella & Choco', 'Almond Shells'],
    image: img(shopfrontNew),
  },
  {
    id: 'counter',
    label: 'The Counter',
    eyebrow: 'Fresh out of the oven',
    title: 'Three things done right.',
    body: 'We keep the menu small so we can make everything properly. Whole cakes, cracked-top cookies, and delicate French macarons.',
    chips: ['Sponge & Cream', 'Nutella & Choco', 'Almond Shells'],
    image: img(counterImg),
  },
  {
    id: 'bakehouse-idle',
    label: 'The Bakehouse',
    eyebrow: 'Behind the glass',
    title: 'Real butter, zero shortcuts.',
    body: 'Laminated by hand every night. 72-hour cold fermented doughs, French butter, and organic raw cane sugar.',
    chips: ['72hr Ferment', 'French Butter', 'Artisan Technique'],
    image: img(bakehouseIdle),
  },
  {
    id: 'bakehouse-open',
    label: 'The Bakehouse',
    eyebrow: 'Behind the glass',
    title: 'Real butter, zero shortcuts.',
    body: 'Laminated by hand every night. 72-hour cold fermented doughs, French butter, and organic raw cane sugar.',
    chips: ['72hr Ferment', 'French Butter', 'Artisan Technique'],
    image: img(bakehouseOpen),
  },
  {
    id: 'terrace',
    label: 'The Terrace',
    eyebrow: site.contact.address,
    title: 'Morning sun, warm crusts.',
    body: 'A quiet morning spot above the avenue. Fresh batch sourdoughs, croissants, and single-origin coffee poured from 8 AM.',
    chips: ['Outdoor Seating', 'Pour-over', 'Daily 8am-10pm'],
    image: img(terraceImg),
  },
]

/**
 * Optional scroll-scrubbed footage.
 */
export const heroVideo: { src: string; poster?: string } | null = null
