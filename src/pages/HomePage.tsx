import { BakehouseLive } from '../sections/home/BakehouseLive'
import { CategoryShowcase } from '../sections/home/CategoryShowcase'
import { CraftProcess } from '../sections/home/CraftProcess'
import { ScrollHero } from '../sections/home/ScrollHero'
import { Testimonials } from '../sections/home/Testimonials'

export function HomePage() {
  return (
    <>
      <ScrollHero />
      <CategoryShowcase />
      <BakehouseLive />
      <CraftProcess />
      <Testimonials />
    </>
  )
}

