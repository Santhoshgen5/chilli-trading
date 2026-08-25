import type { ReactNode } from 'react'

// Navigation is plain `<a href>` — there is no client-side router, so a link is
// a link. `<button>` is reserved for things that are not navigation (form
// submits, the mobile menu toggle).

type Variant = 'primary' | 'secondary' | 'on-dark' | 'on-dark-outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50'

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const variants: Record<Variant, string> = {
  // Solid navy — the primary conversion action.
  primary:
    'bg-navy-700 text-paper shadow-card hover:bg-navy-900 hover:shadow-lift hover:-translate-y-px active:translate-y-0',
  // Outline on paper — secondary.
  secondary:
    'border border-paper-line-strong bg-paper-50 text-navy-700 shadow-hairline hover:border-navy-400 hover:text-navy-900 hover:shadow-card hover:-translate-y-px active:translate-y-0',
  // Gold solid, for use inside a dark band. navy-900 on gold is 7.5:1.
  'on-dark':
    'bg-gold-500 text-navy-900 shadow-card hover:bg-gold-300 hover:-translate-y-px active:translate-y-0',
  // Outline inside a dark band.
  'on-dark-outline':
    'border border-navy-300/40 text-paper hover:border-navy-200 hover:bg-paper/10 hover:-translate-y-px active:translate-y-0',
  // Inline text link. cyan-700 clears 4.5:1 on paper.
  ghost:
    'text-cyan-700 underline underline-offset-4 decoration-cyan-700/30 hover:decoration-cyan-700',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

interface AnchorProps extends CommonProps {
  href: string
  /** Opens in a new tab with the usual rel guard. */
  external?: boolean
  type?: never
  onClick?: never
}

interface ButtonElProps extends CommonProps {
  type?: 'button' | 'submit'
  onClick?: () => void
  href?: never
  external?: never
}

type Props = AnchorProps | ButtonElProps

export function Button(props: Props) {
  const { variant = 'primary', size = 'md', className = '', children } = props
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  if ('href' in props && props.href) {
    return (
      <a
        href={props.href}
        className={cls}
        {...(props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
