export function Stars({ rating, outOf = 5 }: { rating: number; outOf?: number }) {
  return (
    <span role="img" aria-label={`${rating} out of ${outOf} stars`} className="inline-flex gap-0.5 text-sm text-gold">
      {Array.from({ length: outOf }, (_, i) => (
        <span key={i} aria-hidden="true" className={i < rating ? '' : 'opacity-25'}>
          ★
        </span>
      ))}
    </span>
  )
}
