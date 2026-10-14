import type { Collection } from '../../data/collections'
import { Chip } from '../ui'

export interface FilterChipsProps {
  allLabel: string
  allCount: number
  options: Collection[]
  value: string | null
  onChange: (id: string | null) => void
}

export function FilterChips({ allLabel, allCount, options, value, onChange }: FilterChipsProps) {
  return (
    <div role="group" aria-label="Filter products" className="flex flex-wrap justify-center gap-2">
      <Chip active={value === null} onClick={() => onChange(null)}>
        {allLabel} ({allCount})
      </Chip>
      {options.map((o) => (
        <Chip key={o.id} active={value === o.id} onClick={() => onChange(value === o.id ? null : o.id)}>
          <span aria-hidden="true">{o.emoji}</span> {o.label}
        </Chip>
      ))}
    </div>
  )
}
