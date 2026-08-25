// Brand marks.
//
// Two supplied assets, each used where it actually works:
//
//  · The horizontal wordmark (assets/wordmark.png) is the lockup with the
//    aircraft, the globe and the Tamil script. It arrives rotated a quarter
//    turn and heavily padded; the pipeline straightens and trims it to roughly
//    8:1, which is the right shape for a header bar.
//  · The stacked lockup (assets/logo.png) sets MAVEH WORLD *inside* the mark,
//    so its type collapses below about 96px. It goes in the footer, where
//    there is room to show it properly.
//
// The wordmark is black artwork on transparency, which would vanish against
// the navy hero. Rather than invert it — which would turn the red aircraft
// cyan — the pipeline emits a second copy with the neutral lettering lifted to
// paper and the saturated brand colours left alone.

interface LogoProps {
  className?: string
  /** `navy` for paper surfaces, `paper` for dark bands. */
  tone?: 'navy' | 'paper'
}

const WORDMARK_RATIO = 1971 / 248
const WORDMARK_HEIGHT = 32
const WORDMARK_WIDTH = Math.round(WORDMARK_HEIGHT * WORDMARK_RATIO)

/** Header wordmark. Carries the link's accessible name via its alt text. */
export function Logo({ className = '', tone = 'navy' }: LogoProps) {
  const variant = tone === 'paper' ? 'light' : 'dark'

  return (
    <img
      src={`/media/wordmark-${variant}-64.webp`}
      srcSet={`/media/wordmark-${variant}-64.webp 509w, /media/wordmark-${variant}-128.webp 1018w`}
      sizes={`${WORDMARK_WIDTH}px`}
      width={WORDMARK_WIDTH}
      height={WORDMARK_HEIGHT}
      alt="MAVEH WORLD"
      className={`h-7 w-auto sm:h-8 ${className}`}
    />
  )
}

const LOCKUP = { width: 85, height: 96 }

/** The full stacked lockup, for places with room to show it properly. */
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
