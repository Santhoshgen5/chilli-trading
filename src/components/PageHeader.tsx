import type { ReactNode } from 'react'
import { Container } from './Section'
import { Eyebrow } from './Section'

/** Standard inner-page header: eyebrow + H1 + intro, on paper. */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro?: ReactNode
}) {
  return (
    <div className="border-b border-paper-line">
      <Container className="py-14 sm:py-20">
        <div className="max-w-prose">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl sm:text-5xl">{title}</h1>
          {intro && <p className="mt-5 text-lg leading-relaxed text-navy-500">{intro}</p>}
        </div>
      </Container>
    </div>
  )
}
