import { useParams } from 'react-router-dom'
import { Container, SectionHeading } from '../components/ui'
import { getCategory } from '../data/categories'
import { NotFoundPage } from './NotFoundPage'

/** Heading only for now — filters, search and the product grid arrive in Phase 4. */
export function CategoryPage() {
  const category = getCategory(useParams().category)
  if (!category) return <NotFoundPage />

  return (
    <Container className="min-h-[60vh] py-16 sm:py-20">
      <SectionHeading as="h1" eyebrow={category.eyebrow} title={category.title} intro={category.intro} />
    </Container>
  )
}
