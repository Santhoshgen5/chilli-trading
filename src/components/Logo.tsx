/** Typographic wordmark — no mascot, no produce imagery. */
export function Logo({ className = '', tone = 'navy' }: { className?: string; tone?: 'navy' | 'paper' }) {
  const primary = tone === 'paper' ? 'text-paper' : 'text-navy-900'
  const secondary = tone === 'paper' ? 'text-paper/60' : 'text-navy-400'
  return (
    <span className={`inline-flex items-baseline gap-1.5 font-display ${primary} ${className}`}>
      <span aria-hidden className="mr-0.5 inline-block h-4 w-[3px] translate-y-[1px] bg-gold-500" />
      <span className="text-lg font-bold tracking-tight">MAVEH</span>
      <span className={`text-lg font-normal tracking-[0.2em] ${secondary}`}>WORLD</span>
    </span>
  )
}
