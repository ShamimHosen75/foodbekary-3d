import { Container, SectionHeading } from '../components/ui'
import { site } from '../data/site'
import { ComponentGallery } from './design/ComponentGallery'
import { Swatches } from './design/Swatches'
import { TypeScale } from './design/TypeScale'

/** Phase 1 living style guide — proves every token and primitive renders. */
export function DesignSystemPage() {
  return (
    <Container size="wide" className="space-y-16 py-16 sm:py-24">
      <SectionHeading
        as="h1"
        eyebrow={`${site.name} · design system`}
        title="Tokens & primitives"
        intro="Every colour, type style and UI building block the storefront is made from."
      />
      <section aria-labelledby="colours" className="space-y-5">
        <h2 id="colours" className="text-2xl font-semibold">Colour</h2>
        <Swatches />
      </section>
      <section aria-labelledby="type" className="space-y-5">
        <h2 id="type" className="text-2xl font-semibold">Typography</h2>
        <TypeScale />
      </section>
      <section aria-labelledby="components" className="space-y-5">
        <h2 id="components" className="text-2xl font-semibold">Components</h2>
        <ComponentGallery />
      </section>
    </Container>
  )
}
