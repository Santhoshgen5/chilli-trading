import type { ReactNode } from 'react'

/** Centered content column with responsive gutters. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  )
}

/** Vertical rhythm wrapper for a page section. */
export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      {children}
    </section>
  )
}

/** Mono eyebrow label — the instrument-readout motif. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="label-mono flex items-center gap-2">
      <span aria-hidden className="inline-block h-px w-6 bg-gold-500" />
      {children}
    </p>
  )
}

/** Section heading with optional eyebrow + intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: As = 'h2',
  className = '',
}: {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}) {
  return (
    <div className={`max-w-prose ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <As className={`mt-4 text-3xl sm:text-4xl ${As === 'h1' ? 'sm:text-5xl' : ''}`}>
        {title}
      </As>
      {intro && <p className="mt-4 text-lg leading-relaxed text-navy-500">{intro}</p>}
    </div>
  )
}
