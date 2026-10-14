import type { ProductSeed } from './types'

const piped = ['🌸 Hand-piped', '🌰 Almond flour', '🚫 Gluten-free shells']

export const macarons: ProductSeed[] = [
  {
    slug: 'pistachio-macaron', name: 'Pistachio Macaron', category: 'macarons', price: 90,
    description: 'Pale green almond shells filled with roasted pistachio buttercream.',
    ingredients: ['Pistachio paste', 'Almond shells', 'Buttercream'], features: piped,
    collections: ['singles', 'chef'], tags: ['nutty', 'green'], stock: 60,
  },
  {
    slug: 'raspberry-macaron', name: 'Raspberry Macaron', category: 'macarons', price: 90,
    description: 'Bright raspberry shells with a tart raspberry jam centre.',
    ingredients: ['Raspberry jam', 'Almond shells', 'White chocolate ganache'], features: piped,
    collections: ['singles'], tags: ['berry', 'pink'], stock: 50,
  },
  {
    slug: 'lemon-macaron', name: 'Zesty Lemon Macaron', category: 'macarons', price: 90,
    description: 'Sunny shells with a sharp homemade lemon curd buttercream.',
    ingredients: ['Lemon curd', 'Almond shells', 'Buttercream'], features: piped,
    badge: 'Zesty', collections: ['singles'], tags: ['citrus', 'yellow'], stock: 0,
  },
  {
    slug: 'salted-caramel-macaron', name: 'Salted Caramel Macaron', category: 'macarons', price: 100,
    description: 'Golden shells sandwiching a soft salted caramel ganache.',
    ingredients: ['Salted caramel', 'Almond shells', 'Milk chocolate'], features: piped,
    badge: 'Chef’s pick', collections: ['singles', 'chef'], tags: ['caramel'], stock: 40,
  },
  {
    slug: 'macaron-gift-box', name: 'Macaron Gift Box (6)', category: 'macarons', price: 520,
    description: 'Six assorted macarons in a ribboned box — pistachio, raspberry, caramel and more.',
    ingredients: ['6 assorted macarons', 'Gift box'], features: piped,
    badge: 'Gift set', collections: ['gifts', 'chef'], tags: ['gift', 'box', 'assorted'], stock: 15,
  },
  {
    slug: 'rainbow-macaron-tower', name: 'Rainbow Macaron Tower', category: 'macarons', price: 2400,
    description: 'Forty pastel macarons stacked into a tower — the centrepiece for weddings and parties.',
    ingredients: ['40 assorted macarons', 'Display stand'], features: piped,
    badge: 'Showpiece', collections: ['gifts'], tags: ['wedding', 'tower', 'party'], stock: 2,
  },
]
