import type { ProductSeed } from './types'

const warm = ['🔥 Baked hourly', '🧈 Brown butter', '🚫 No preservatives']

export const cookies: ProductSeed[] = [
  {
    slug: 'classic-chocolate-chunk', name: 'Classic Chocolate Chunk', category: 'cookies', price: 120,
    description: 'Brown butter dough packed with chunks of dark and milk chocolate. Crisp edge, soft centre.',
    ingredients: ['Dark chocolate', 'Milk chocolate', 'Brown butter'], features: warm,
    badge: 'Classic', collections: ['bestsellers'], tags: ['chocolate chip'], stock: 40,
  },
  {
    slug: 'nutella-stuffed-cookie', name: 'Nutella Stuffed Cookie', category: 'cookies', price: 180,
    description: 'A thick cocoa cookie hiding a molten Nutella centre. Best eaten warm.',
    ingredients: ['Nutella', 'Cocoa dough', 'Sea salt'], features: warm,
    badge: 'Bestseller', collections: ['bestsellers', 'stuffed'], tags: ['hazelnut', 'gooey'], stock: 25,
  },
  {
    slug: 'pistachio-kunafa-cookie', name: 'Pistachio Kunafa Cookie', category: 'cookies', price: 220,
    description: 'Buttery cookie stuffed with pistachio cream and crispy kunafa threads.',
    ingredients: ['Pistachio cream', 'Kunafa', 'White chocolate'], features: warm,
    badge: 'New', collections: ['stuffed'], tags: ['dubai', 'pistachio'], stock: 12,
  },
  {
    slug: 'double-dark-cookie', name: 'Double Dark Cookie', category: 'cookies', price: 150,
    description: 'Black cocoa dough with 70% chocolate pools for serious chocolate lovers.',
    ingredients: ['Black cocoa', '70% chocolate', 'Flaky salt'], features: warm,
    collections: [], tags: ['dark chocolate'], stock: 30,
  },
  {
    slug: 'cookie-box-six', name: 'Cookie Box of Six', category: 'cookies', price: 850,
    description: 'Six of today’s cookies in a gift box — a mix of classics and stuffed favourites.',
    ingredients: ['Assorted cookies', 'Gift box'], features: warm,
    badge: 'Gift box', collections: ['boxes', 'bestsellers'], tags: ['gift', 'assorted', 'box'], stock: 10,
  },
  {
    slug: 'cookie-platter-twelve', name: 'Party Cookie Platter', category: 'cookies', price: 1600,
    description: 'A dozen warm cookies arranged on a platter, ready for the table.',
    ingredients: ['12 assorted cookies', 'Serving platter'], features: warm,
    badge: 'Platter', collections: ['boxes'], tags: ['party', 'dozen', 'platter'], stock: 4,
  },
]
