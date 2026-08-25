import type { ReactNode } from 'react'

type Tone = 'neutral' | 'accent' | 'dark' | 'on-dark'

const tones: Record<Tone, string> = {
  // Default pill on a paper surface.
  neutral: 'border-paper-line-strong bg-paper-50 text-navy-600',
  // Carries the gold dot — used for registrations.
  accent: 'border-gold-500/35 bg-gold-500/[0.07] text-navy-700',
  // Solid navy pill on a light surface.
  dark: 'border-transparent bg-navy-700 text-paper',
  // Pill sitting inside a dark band.
  'on-dark': 'border-navy-300/25 bg-paper/[0.06] text-navy-200',
}

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  /** Leading dot. Gold on `accent`, otherwise inherits the text colour. */
  dot?: boolean
  className?: string
}

/** Small pill. Used for packing formats, registrations and spec tags. */
export function Badge({ children, tone = 'neutral', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {dot && (
        <span
          aria-hidden
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            tone === 'accent' ? 'bg-gold-500' : 'bg-current opacity-60'
          }`}
        />
      )}
      {children}
    </span>
  )
}

interface PungencyBadgeProps {
  /** Written pungency, e.g. "Very high". Comes from the variety data. */
  label: string
  /** 1–3, derived from the variety's SHU range — see `heatLevel()`. */
  level: 1 | 2 | 3
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * Pungency pill with a three-step level meter.
 *
 * The meter is a redundant encoding of the written label, never a replacement
 * for it — the words carry the meaning, so nothing is lost if the bars are not
 * perceivable. The level itself is derived from the SHU range rather than
 * assigned by hand, so it cannot drift away from the specification.
 */
export function PungencyBadge({
  label,
  level,
  tone = 'light',
  className = '',
}: PungencyBadgeProps) {
  const dark = tone === 'dark'
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-pill border px-3 py-1.5 ${
        dark
          ? 'border-navy-300/25 bg-paper/[0.06] text-navy-200'
          : 'border-paper-line-strong bg-paper-50 text-navy-600'
      } ${className}`}
    >
      <span aria-hidden className="flex items-end gap-[3px]">
        {([1, 2, 3] as const).map((step) => (
          <span
            key={step}
            className={`w-[3px] rounded-sm transition-colors ${
              step === 1 ? 'h-2' : step === 2 ? 'h-2.5' : 'h-3'
            } ${
              step <= level
                ? dark
                  ? 'bg-gold-300'
                  : 'bg-navy-700'
                : dark
                  ? 'bg-paper/20'
                  : 'bg-navy-200'
            }`}
          />
        ))}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </span>
  )
}
