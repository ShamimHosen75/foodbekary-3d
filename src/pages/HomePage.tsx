import { Link } from 'react-router-dom'
import { buttonClasses, Container, SectionHeading } from '../components/ui'
import { categories, categoryPath } from '../data/categories'
import { site } from '../data/site'

/**
 * Phase 2 placeholder so the shell can be tested end to end.
 * The scroll hero, category showcase and testimonials replace this in Phase 3.
 */
export function HomePage() {
  return (
    <>
      <section className="grid min-h-[85vh] place-items-center bg-gradient-to-b from-sand to-cream">
        <Container className="text-center">
          <SectionHeading as="h1" eyebrow={site.tagline} title={site.name} intro="Hero placeholder — Phase 3." />
        </Container>
      </section>
      <Container className="py-24">
        <ul className="flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={categoryPath(c.slug)} className={buttonClasses('outline')}>
                {c.emoji} {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
