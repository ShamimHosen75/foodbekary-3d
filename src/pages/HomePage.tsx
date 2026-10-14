import { CategoryShowcase } from '../sections/home/CategoryShowcase'
import { ScrollHero } from '../sections/home/ScrollHero'
import { Testimonials } from '../sections/home/Testimonials'

export function HomePage() {
  return (
    <>
      <ScrollHero />
      <CategoryShowcase />
      <Testimonials />
    </>
  )
}
