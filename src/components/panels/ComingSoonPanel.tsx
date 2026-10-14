/** Placeholder body for panels whose feature lands in a later phase. */
export function ComingSoonPanel({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <span aria-hidden="true" className="text-4xl">{icon}</span>
      <p className="text-sm text-muted">{text}</p>
    </div>
  )
}
