import type { ReactNode } from 'react'

// Depth comes from a hairline border plus a navy-tinted shadow, never a black
// one — a neutral shadow over the warm paper ground reads as grey dirt.

type Surface = 'paper' | 'dark'

interface CardProps {
  children: ReactNode
  /**
   * Element to render. Use `dl` when the card's content is label/value pairs:
   * a <dl> may only contain <dt>/<dd> (optionally one <div> deep), so wrapping
   * a styled <div> around them would be invalid. Ignored when `href` is set.
   */
  as?: 'div' | 'dl' | 'li'
  surface?: Surface
  /** Whole-card link. Renders an <a> and enables the hover lift. */
  href?: string
  /** Lift on hover even when the card is not a link. */
  interactive?: boolean
  className?: string
}

const surfaces: Record<Surface, string> = {
  paper: 'border-paper-line bg-paper-50 shadow-card',
  dark: 'surface-dark border-navy-700/60 bg-navy-tile shadow-tile',
}

const hover: Record<Surface, string> = {
  paper: 'hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift',
  dark: 'hover:-translate-y-1 hover:border-navy-600 hover:shadow-lift',
}

export function Card({
  children,
  as: Tag = 'div',
  surface = 'paper',
  href,
  interactive = false,
  className = '',
}: CardProps) {
  const lifts = Boolean(href) || interactive
  const cls = [
    'group relative flex flex-col rounded-card border',
    surfaces[surface],
    'transition-[transform,box-shadow,border-color] duration-300 ease-out',
    lifts ? hover[surface] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }

  return <Tag className={cls}>{children}</Tag>
}
