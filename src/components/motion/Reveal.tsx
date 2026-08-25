import { useInView } from 'framer-motion'
import { useRef, type ElementType, type ReactNode } from 'react'
import { useMotionPrefs, VIEWPORT } from '../../lib/motion'

/**
 * Fade-and-rise on first scroll into view.
 *
 * The trigger is framer-motion's `useInView`; the transition itself is CSS (see
 * `[data-reveal]` in index.css). That split is deliberate:
 *
 *  - Nothing is written into the server-rendered markup, so the HTML this page
 *    ships is visible on its own. A reader without JS gets the page, not a
 *    blank column of invisible sections.
 *  - The transition runs on the compositor rather than through the JS animation
 *    loop, which matters when a long page has forty of these.
 *
 * `prefers-reduced-motion` is honoured twice over — the CSS start state is not
 * applied at all, and the stagger delay collapses to zero here.
 */

type Tag = Extract<ElementType, 'div' | 'section' | 'li' | 'ul' | 'ol' | 'p' | 'span' | 'article' | 'figure'>

interface RevealProps {
  children: ReactNode
  /** Position among siblings — drives the ~60ms stagger. */
  index?: number
  /** Additional delay in seconds, applied on top of the stagger. */
  delay?: number
  as?: Tag
  className?: string
}

export function Reveal({
  children,
  index = 0,
  delay = 0,
  as: Component = 'div',
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, VIEWPORT)
  const { stagger, reduced } = useMotionPrefs()

  const totalDelay = reduced ? 0 : stagger(index) + delay
  const style = totalDelay
    ? ({ '--reveal-delay': `${Math.round(totalDelay * 1000)}ms` } as React.CSSProperties)
    : undefined

  const Tag = Component as ElementType

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-shown={inView ? '' : undefined}
      style={style}
      className={className}
    >
      {children}
    </Tag>
  )
}
