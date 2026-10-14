import { Reveal, RevealGroup, RevealItem } from '../../components/motion/Reveal'
import { Container, SectionHeading } from '../../components/ui'
import { categories } from '../../data/categories'
import { CategoryCard } from './CategoryCard'

export function CategoryShowcase() {
  return (
    <section aria-labelledby="showcase-title" className="py-20 sm:py-28">
      <Container size="content" className="max-w-[60rem]">
        <Reveal>
          <SectionHeading
            id="showcase-title"
            eyebrow="From our ovens"
            title="Four trays, baked daily."
            intro="Everything is made on site in small batches each morning. Pick a tray to see what’s on it today."
          />
        </Reveal>
        <RevealGroup as="ul" className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <RevealItem as="li" key={c.slug}>
              <CategoryCard category={c} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  )
}
