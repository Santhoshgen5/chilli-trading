import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { EASE_OUT, useMotionPrefs, VIEWPORT } from '../../lib/motion'

interface CounterProps {
  /** The real, final number. Never a placeholder. */
  value: number
  /** Rendered after the number, e.g. "MT". */
  suffix?: string
  /** Formats the running value. Defaults to a thousands-separated integer. */
  format?: (n: number) => string
  /** Seconds to count up. */
  duration?: number
  className?: string
}

const defaultFormat = (n: number) => n.toLocaleString('en-GB')

/**
 * Counts up to `value` when scrolled into view, once.
 *
 * Renders the final value during SSR so the number is correct in the shipped
 * HTML and for assistive technology; the count-up is a client-side flourish
 * layered on afterwards. The animating text is hidden from the accessibility
 * tree so a screen reader is not read a stream of intermediate numbers.
 */
export function Counter({
  value,
  suffix,
  format = defaultFormat,
  duration = 1.4,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, VIEWPORT)
  const { reduced } = useMotionPrefs()

  // Starts at the true value: that is what SSR emits and what a reader without
  // JS keeps.
  const [display, setDisplay] = useState(value)

  // On the client, drop to zero as soon as we hydrate — before the band has
  // been scrolled to — so the count-up has somewhere to start from without the
  // number visibly snapping backwards.
  useEffect(() => {
    if (!reduced) setDisplay(0)
  }, [reduced])

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduced, value, duration])

  const final = suffix ? `${format(value)} ${suffix}` : format(value)

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {format(display)}
        {suffix ? <span className="ml-1.5">{suffix}</span> : null}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
