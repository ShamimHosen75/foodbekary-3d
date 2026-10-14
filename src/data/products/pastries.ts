import type { ProductSeed } from './types'

const slice = ['🍰 Single slice', '🥛 Fresh cream', '🚫 No preservatives']

export const pastries: ProductSeed[] = [
  {
    slug: 'chocolate-fudge-slice', name: 'Chocolate Fudge Slice', category: 'pastries', price: 220,
    description: 'Soft chocolate sponge with dark fudge layers and a ganache drip.',
    ingredients: ['Dark fudge', 'Chocolate sponge', 'Ganache'], features: slice,
    badge: 'Bestseller', collections: ['bestsellers', 'chocolate'], tags: ['fudge'], stock: 20,
  },
  {
    slug: 'black-forest-slice', name: 'Black Forest Slice', category: 'pastries', price: 240,
    description: 'Cocoa sponge, whipped cream and cherries finished with chocolate shavings.',
    ingredients: ['Cherries', 'Whipped cream', 'Chocolate shavings'], features: slice,
    collections: ['chocolate'], tags: ['cherry'], stock: 15,
  },
  {
    slug: 'red-velvet-slice', name: 'Red Velvet Slice', category: 'pastries', price: 230,
    description: 'Velvet sponge with smooth vanilla cream cheese frosting.',
    ingredients: ['Velvet sponge', 'Cream cheese', 'Vanilla'], features: slice,
    badge: 'Popular', collections: ['bestsellers', 'red-velvet'], tags: ['cream cheese'], stock: 18,
  },
  {
    slug: 'pineapple-cream-slice', name: 'Pineapple Cream Slice', category: 'pastries', price: 180,
    description: 'Light sponge soaked in pineapple syrup with fresh cream and fruit.',
    ingredients: ['Pineapple', 'Fresh cream', 'Vanilla sponge'], features: slice,
    badge: 'Fresh daily', collections: ['fruit'], tags: ['tropical'], stock: 25,
  },
  {
    slug: 'mango-mousse-slice', name: 'Mango Mousse Slice', category: 'pastries', price: 250, salePrice: 210,
    description: 'Silky mango mousse on a thin almond base with a mango glaze.',
    ingredients: ['Mango mousse', 'Almond base', 'Mango glaze'], features: slice,
    badge: 'Seasonal', collections: ['fruit'], tags: ['mango', 'mousse'], stock: 3,
  },
  {
    slug: 'tiramisu-cup', name: 'Tiramisu Cup', category: 'pastries', price: 260,
    description: 'Espresso-soaked sponge layered with mascarpone cream and dusted with cocoa.',
    ingredients: ['Espresso', 'Mascarpone', 'Cocoa'], features: slice,
    badge: 'New', collections: [], tags: ['coffee', 'italian'], stock: 10,
  },
]
