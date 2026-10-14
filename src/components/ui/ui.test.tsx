import { render, screen } from '@testing-library/react'
import { Button, Chip, IconButton, SectionHeading } from '.'

describe('UI primitives', () => {
  it('Button defaults to type="button" so it never submits forms by accident', () => {
    render(<Button>Add</Button>)
    expect(screen.getByRole('button', { name: 'Add' })).toHaveAttribute('type', 'button')
  })

  it('Chip exposes its selected state', () => {
    render(<Chip active>All</Chip>)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('IconButton is named by its label, not its emoji', () => {
    render(<IconButton label="Search">🔍</IconButton>)
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('SectionHeading renders the requested heading level', () => {
    render(<SectionHeading as="h1" eyebrow="The counter" title="Fresh today" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Fresh today' })).toBeInTheDocument()
  })
})
