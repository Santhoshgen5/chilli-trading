import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none'

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const variants: Record<Variant, string> = {
  // Navy solid — primary conversion action (RFQ).
  primary: 'bg-navy-700 text-paper hover:bg-navy-900',
  // Navy outline — secondary.
  secondary:
    'border border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-paper',
  // Understated — tertiary / inline.
  ghost: 'text-navy-700 hover:text-cyan-700 underline underline-offset-4 decoration-navy-400/40 hover:decoration-cyan-700',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

interface LinkProps extends CommonProps {
  to: string
  href?: never
  onClick?: never
  type?: never
}
interface AnchorProps extends CommonProps {
  href: string
  to?: never
  onClick?: never
  type?: never
  /** Set for external links. */
  external?: boolean
}
interface ButtonElProps extends CommonProps {
  onClick?: () => void
  type?: 'button' | 'submit'
  to?: never
  href?: never
}

type Props = LinkProps | AnchorProps | ButtonElProps

export function Button(props: Props) {
  const { variant = 'primary', size = 'md', className = '', children } = props
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={cls}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const ext = props.external
    return (
      <a
        href={props.href}
        className={cls}
        {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  const { onClick, type = 'button' } = props as ButtonElProps
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
