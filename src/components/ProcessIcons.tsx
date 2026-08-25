import type { ComponentType } from 'react'

// One glyph per process step. Deliberately plain line drawings on a 24px grid —
// they label the step, they are not illustrations. Every one is aria-hidden;
// the step title beside it carries the meaning.

type IconProps = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

/** Sourcing — a pod on the stem. */
function Sourcing({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4.5c0-1 .8-1.5 1.8-1.5" />
      <path d="M12 4.5c2.8 0 5 2.2 5 5 0 4.4-2.6 8.2-5 10-2.4-1.8-5-5.6-5-10 0-2.8 2.2-5 5-5Z" />
      <path d="M12 8.5v7" />
    </svg>
  )
}

/** Machine cleaning — material falling through a sieve. */
function Cleaning({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 8.5h17l-2.5 5.5H6L3.5 8.5Z" />
      <path d="M7.5 4v2.5M12 3v3.5M16.5 4v2.5" />
      <path d="M9 17v2.5M12 17.5v3M15 17v2.5" />
    </svg>
  )
}

/** Colour sorting — a stream separating into two. */
function Sorting({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v6" />
      <path d="M12 9 6.5 15v5.5" />
      <path d="M12 9l5.5 6v5.5" />
      <circle cx="6.5" cy="20.5" r="1.2" />
      <circle cx="17.5" cy="20.5" r="1.2" />
    </svg>
  )
}

/** Metal detection — a scan arc over a passing lot. */
function MetalDetection({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M7.5 13a4.5 4.5 0 0 1 9 0" />
      <path d="M3 18.5h18" />
      <path d="M11 13h2v2h-2z" />
    </svg>
  )
}

/** Moisture testing — a droplet with a reading line. */
function Moisture({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5c3 3.6 5 6.4 5 9a5 5 0 0 1-10 0c0-2.6 2-5.4 5-9Z" />
      <path d="M8.5 14.5h7" />
    </svg>
  )
}

/** Quality inspection — a specification checked. */
function Inspection({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 3.5h9l4 4v13H6z" />
      <path d="M15 3.5v4h4" />
      <path d="m9.5 13 2 2 4-4" />
    </svg>
  )
}

/** Hygienic packing — a sealed sack. */
function Packing({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8.5 3.5h7l-1 3h-5l-1-3Z" />
      <path d="M9.5 6.5h5c2.2 1.8 3.5 4.4 3.5 7.5v3a3.5 3.5 0 0 1-3.5 3.5h-5A3.5 3.5 0 0 1 6 17v-3c0-3.1 1.3-5.7 3.5-7.5Z" />
      <path d="M9.5 12.5h5" />
    </svg>
  )
}

/**
 * Keyed by the `title` in `company.process`. A step with no matching glyph
 * falls back to its ordinal, so adding a process step never breaks the page.
 */
export const processIcons: Record<string, ComponentType<IconProps>> = {
  Sourcing,
  'Machine cleaning': Cleaning,
  'Colour sorting': Sorting,
  'Metal detection': MetalDetection,
  'Moisture testing': Moisture,
  'Quality inspection': Inspection,
  'Hygienic packing': Packing,
}
