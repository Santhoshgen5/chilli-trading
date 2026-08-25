import type { ReactNode } from 'react'
import { Reveal } from './motion/Reveal'

/** Centred content column with responsive gutters. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-shell px-5 sm:px-8 ${className}`}>{children}</div>
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
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  )
}

/** Hairline section divider, inset to the content column. */
export function Divider({ className = '' }: { className?: string }) {
  return (
    <Container>
      <hr className={`border-0 border-t border-paper-line ${className}`} />
    </Container>
  )
}

/** Mono eyebrow label, led by the gold hairline. */
export function Eyebrow({
  children,
  tone = 'light',
}: {
  children: ReactNode
  tone?: 'light' | 'dark'
}) {
  // items-start, not items-center: when the label wraps to two lines on a
  // narrow screen, a centred rule floats between them.
  return (
    <p className={`flex items-start gap-3 ${tone === 'dark' ? 'label-mono-dark' : 'label-mono'}`}>
      <span aria-hidden className="rule-gold mt-[0.55em] w-8 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  as?: 'h1' | 'h2'
  tone?: 'light' | 'dark'
  className?: string
  /** Suppress the scroll reveal (for content already visible on load). */
  static?: boolean
}

/** Section heading with optional eyebrow and intro paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: As = 'h2',
  tone = 'light',
  className = '',
  static: isStatic = false,
}: SectionHeadingProps) {
  const body = (
    <>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <As
        className={`mt-5 text-display-sm sm:text-display-md ${
          As === 'h1' ? 'lg:text-display-lg' : ''
        } ${tone === 'dark' ? 'text-paper' : 'text-navy-900'}`}
      >
        {title}
      </As>
      {intro && (
        <p
          className={`mt-5 max-w-prose text-lg leading-relaxed ${
            tone === 'dark' ? 'text-navy-200' : 'text-navy-500'
          }`}
        >
          {intro}
        </p>
      )}
    </>
  )

  if (isStatic) return <div className={`max-w-3xl ${className}`}>{body}</div>

  return (
    <Reveal className={`max-w-3xl ${className}`}>{body}</Reveal>
  )
}
