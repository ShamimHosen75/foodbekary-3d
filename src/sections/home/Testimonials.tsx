import { Reveal, RevealGroup, RevealItem } from '../../components/motion/Reveal'
import { Badge, Card, Container, SectionHeading, Stars } from '../../components/ui'
import { site } from '../../data/site'
import { testimonials } from '../../data/testimonials'

export function Testimonials() {
  return (
    <section aria-labelledby="reviews-title" className="border-t border-line bg-cream-soft py-20 sm:py-28">
      <Container size="content" className="max-w-[60rem]">
        <Reveal>
          <SectionHeading
            id="reviews-title"
            eyebrow="Kind words"
            title={`Why Dhaka keeps coming back to ${site.name}.`}
            intro="A few notes from people who’ve shared our cakes at their tables."
          />
        </Reveal>
        <RevealGroup as="ul" className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <RevealItem as="li" key={t.id} className="h-full">
              <Card as="figure" className="h-full gap-4 p-5">
                <Stars rating={t.rating} />
                <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-ink/85 italic">“{t.quote}”</blockquote>
                <figcaption className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2 border-t border-line pt-4">
                  <span>
                    <span className="block font-display font-semibold whitespace-nowrap text-ink">{t.name}</span>
                    <span className="block text-xs whitespace-nowrap text-muted">{t.area}</span>
                  </span>
                  <Badge variant="soft" className="leading-tight">
                    {t.product}
                  </Badge>
                </figcaption>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  )
}
