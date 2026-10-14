import { Link } from 'react-router-dom'
import { buttonClasses, Container, SectionHeading } from '../components/ui'
import { categoryPath } from '../data/categories'

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-8 py-20 text-center">
      <span aria-hidden="true" className="text-6xl">🥐</span>
      <SectionHeading
        as="h1"
        eyebrow="404 · page not found"
        title="This tray is empty."
        intro="The page you were looking for has been eaten, moved or never existed."
      />
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonClasses('primary')}>Back to home</Link>
        <Link to={categoryPath('cakes')} className={buttonClasses('outline')}>Browse the menu</Link>
      </div>
    </Container>
  )
}
