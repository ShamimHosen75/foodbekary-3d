export interface Testimonial {
  id: string
  name: string
  area: string
  quote: string
  product: string
  rating: 1 | 2 | 3 | 4 | 5
}

/** Sample reviews — replace with real customer feedback. */
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Nusrat J.',
    area: 'Dhanmondi, Dhaka',
    quote: 'Ordered the chocolate celebration cake for my mother’s birthday. Moist, not too sweet, and it arrived looking exactly like the photo.',
    product: 'Chocolate Celebration Cake',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Tanvir H.',
    area: 'Uttara, Dhaka',
    quote: 'The stuffed cookies are dangerous. Crunchy outside, gooey middle — the box of six was gone before dinner.',
    product: 'Stuffed Cookie Box',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Farhana R.',
    area: 'Banani, Dhaka',
    quote: 'Finally proper macarons in Dhaka. Light shells, real pistachio, and the gift box was beautiful enough to give away.',
    product: 'Macaron Gift Box',
    rating: 5,
  },
]
