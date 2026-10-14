import kitchen900 from '../assets/hero/scene-kitchen-900.webp'
import kitchen1600 from '../assets/hero/scene-kitchen-1600.webp'
import shopfront900 from '../assets/hero/scene-shopfront-900.webp'
import shopfront1600 from '../assets/hero/scene-shopfront-1600.webp'
import window900 from '../assets/hero/scene-window-900.webp'
import window1600 from '../assets/hero/scene-window-1600.webp'
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

const img = (small: string, large: string) => ({ src: large, srcSet: `${small} 900w, ${large} 1600w` })

export const heroScenes: HeroScene[] = [
  {
    id: 'shopfront',
    label: 'The Shopfront',
    eyebrow: 'Fresh every morning',
    title: 'Small menu. Big care.',
    body: 'We bake four things and give each one our full attention — layered cakes, chunky cookies, hand-piped macarons and cream pastries.',
    chips: ['Real cream', 'Belgian chocolate', 'Almond shells'],
    image: img(shopfront900, shopfront1600),
  },
  {
    id: 'kitchen',
    label: 'The Kitchen',
    eyebrow: 'Behind the counter',
    title: 'Butter, flour, patience.',
    body: 'Doughs rest for two days, butter is cultured, nothing comes from a packet. You can taste the waiting.',
    chips: ['48-hour rest', 'Cultured butter', 'No premixes'],
    image: img(kitchen900, kitchen1600),
  },
  {
    id: 'window',
    label: 'The Window Seat',
    eyebrow: site.contact.address,
    title: 'Coffee’s on at eight.',
    body: 'Grab the corner table, order a pour-over and something still warm from the tray.',
    chips: ['Window seats', 'Pour-over', site.hours.label.replace(':00', '').replace(':00', '')],
    image: img(window900, window1600),
  },
]

/**
 * Optional scroll-scrubbed footage. Drop an MP4 (encoded with short GOPs, e.g.
 * `ffmpeg -i in.mp4 -c:v libx264 -g 6 -crf 24 -an out.mp4`) into /public and set
 * the path here — the hero switches from photo crossfades to video scrubbing.
 */
export const heroVideo: { src: string; poster?: string } | null = null
