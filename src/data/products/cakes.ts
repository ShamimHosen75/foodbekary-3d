import type { ProductSeed } from './types'

const fresh = ['🌿 Baked this morning', '🧈 Real butter', '🚫 No preservatives']

export const cakes: ProductSeed[] = [
  {
    slug: 'chocolate-celebration-cake', name: 'Chocolate Celebration Cake', category: 'cakes', price: 2400,
    description: 'Three layers of moist cocoa sponge with silky chocolate ganache and a glossy drip finish. Serves 10–12.',
    ingredients: ['Belgian dark chocolate', 'Cocoa sponge', 'Fresh cream ganache'], features: fresh,
    badge: 'Bestseller', collections: ['bestsellers', 'chocolate'], tags: ['birthday', 'ganache'], stock: 6,
  },
  {
    slug: 'berry-chantilly-cake', name: 'Berry Chantilly Cake', category: 'cakes', price: 2200,
    description: 'Light chiffon layers with whipped mascarpone cream and a crown of glazed wild berries.',
    ingredients: ['Mixed berries', 'Mascarpone', 'Chiffon sponge'], features: fresh,
    badge: 'Fresh daily', collections: ['fruit'], tags: ['blueberry', 'strawberry', 'cream'], stock: 4,
  },
  {
    slug: 'dark-truffle-drip-cake', name: 'Dark Truffle Drip Cake', category: 'cakes', price: 2600, salePrice: 2300,
    description: '70% dark chocolate sponge layered with truffle cream and topped with hand-rolled truffles.',
    ingredients: ['70% dark chocolate', 'Truffle cream', 'Cocoa nibs'], features: fresh,
    badge: 'Popular', collections: ['bestsellers', 'chocolate'], tags: ['truffle', 'drip'], stock: 5,
  },
  {
    slug: 'strawberry-vanilla-sponge', name: 'Strawberry Vanilla Sponge', category: 'cakes', price: 1800,
    description: 'Airy vanilla bean sponge filled with fresh sliced strawberries and chantilly cream.',
    ingredients: ['Fresh strawberries', 'Vanilla bean', 'Chantilly cream'], features: fresh,
    collections: ['fruit'], tags: ['strawberry', 'vanilla'], stock: 8,
  },
  {
    slug: 'salted-caramel-crunch-cake', name: 'Salted Caramel Crunch Cake', category: 'cakes', price: 2500,
    description: 'Caramel sponge with salted caramel buttercream and a crunchy praline layer.',
    ingredients: ['Salted caramel', 'Hazelnut praline', 'Brown butter sponge'], features: fresh,
    badge: 'Chef’s pick', collections: [], tags: ['caramel', 'praline', 'nuts'], stock: 3,
  },
  {
    slug: 'mango-cream-cake', name: 'Mango Cream Cake', category: 'cakes', price: 2100,
    description: 'Seasonal Rajshahi mangoes folded into fresh cream between soft vanilla layers.',
    ingredients: ['Rajshahi mango', 'Fresh cream', 'Vanilla sponge'], features: fresh,
    badge: 'Seasonal', collections: ['fruit'], tags: ['mango', 'summer'], stock: 0,
  },
  {
    slug: 'lotus-biscoff-cake', name: 'Lotus Biscoff Cake', category: 'cakes', price: 2700,
    description: 'Spiced Biscoff spread layered with fluffy sponge and finished with crunchy cookie crumbs.',
    ingredients: ['Biscoff spread', 'Cinnamon sponge', 'Cookie crumb'], features: fresh,
    badge: 'Trending', collections: [], tags: ['biscoff', 'lotus', 'cookie'], stock: 2,
  },
  {
    slug: 'red-velvet-celebration-cake', name: 'Red Velvet Celebration Cake', category: 'cakes', price: 2300,
    description: 'Crimson velvet layers with tangy cream cheese frosting — a party classic.',
    ingredients: ['Cocoa velvet sponge', 'Cream cheese frosting', 'Buttermilk'], features: fresh,
    collections: ['bestsellers'], tags: ['red velvet', 'cream cheese'], stock: 7,
  },
]
