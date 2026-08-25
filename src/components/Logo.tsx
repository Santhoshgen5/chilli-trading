// The client's logo is a stacked lockup — plane, monogram, and the words MAVEH
// WORLD set inside the mark. It holds up at 96px and above. In a 64px header
// bar it collapses into an unreadable smudge, so the header uses a typographic
// wordmark instead and the lockup is shown at full size in the footer, where it
// has the room it needs.

interface LogoProps {
  className?: string
  /** `navy` for paper surfaces, `paper` for dark bands. */
  tone?: 'navy' | 'paper'
}

/** Header wordmark: gold tick plus the name, set to read at any size. */
export function Logo({ className = '', tone = 'navy' }: LogoProps) {
  const primary = tone === 'paper' ? 'text-paper' : 'text-navy-900'
  const secondary = tone === 'paper' ? 'text-navy-300' : 'text-navy-500'

  return (
    <span className={`inline-flex items-baseline gap-2 font-display ${primary} ${className}`}>
      <span
        aria-hidden
        className="mr-0.5 inline-block h-4 w-[3px] translate-y-[1px] rounded-sm bg-gold-500"
      />
      <span className="text-lg font-bold tracking-tight">MAVEH</span>
      <span className={`text-lg font-normal tracking-[0.2em] ${secondary}`}>WORLD</span>
    </span>
  )
}

const LOCKUP = { width: 85, height: 96 }

/** The full client lockup, for places with room to show it properly. */
export function LogoLockup({
  className = '',
  height = 96,
}: {
  className?: string
  height?: 96 | 192
}) {
  const width = Math.round((LOCKUP.width / LOCKUP.height) * height)
  return (
    <img
      src={`/media/logo-${height}.webp`}
      srcSet="/media/logo-96.webp 85w, /media/logo-192.webp 169w"
      sizes={`${width}px`}
      width={width}
      height={height}
      alt="MAVEH WORLD"
      className={className}
    />
  )
}
