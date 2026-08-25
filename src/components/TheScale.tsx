import { useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Variety } from '../data/types'
import { SHU_AXIS_MAX } from '../data/varieties'
import { STAGGER, useMotionPrefs, VIEWPORT } from '../lib/motion'

// ── The Scale ────────────────────────────────────────────────────────────────
// The site's signature device: a Scoville (SHU) measure running 0 → 100,000 on
// which the varieties are plotted as bands. It reads like a laboratory
// instrument, and it lets a buyer compare pungency across all three at a glance
// without doing arithmetic — which is the single most useful thing this site
// does. Deliberately unsimplified.
//
// Bars grow along the axis when scrolled into view, staggered. The start state
// lives in CSS under `html.js-reveal` (see index.css), so the server-rendered
// markup shows the bands at full length and the page is correct without JS.

const AXIS_TICKS = [0, 25000, 50000, 75000, 100000]

function pct(v: number): number {
  return Math.max(0, Math.min(100, (v / SHU_AXIS_MAX) * 100))
}

function tickLabel(v: number): string {
  return v === 0 ? '0' : `${v / 1000}k`
}

interface Band {
  variety: Variety
  /** Render faintly, for context rather than focus. */
  ghost?: boolean
}

interface TheScaleProps {
  bands: Band[]
  /** Variety name and SHU value beside each track. */
  showRowLabels?: boolean
  /** Numeric tick axis below the tracks. */
  showAxis?: boolean
  tone?: 'light' | 'dark'
  className?: string
  /** Accessible summary of what the scale shows. */
  ariaLabel?: string
}

// Fixed gutters keep the tick axis aligned with the band tracks.
const LABEL_W = 'w-16'
const VALUE_W = 'w-28'

export function TheScale({
  bands,
  showRowLabels = true,
  showAxis = true,
  tone = 'light',
  className = '',
  ariaLabel = 'Scoville heat scale',
}: TheScaleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, VIEWPORT)
  const { reduced } = useMotionPrefs()
  const dark = tone === 'dark'

  // role="img" prunes descendants from the accessibility tree, so a multi-band
  // scale has to carry its data in the label itself.
  const dataSummary = bands
    .map(({ variety }) => `${variety.name} ${variety.shuLabel} Scoville heat units`)
    .join('; ')
  const label = bands.length > 1 ? `${ariaLabel}. ${dataSummary}` : ariaLabel

  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      {showAxis && (
        <div className="mb-4 flex items-baseline gap-4">
          {showRowLabels && <span className={`${LABEL_W} shrink-0`} aria-hidden />}
          <span className={`flex-1 ${dark ? 'label-mono-dark' : 'label-mono'}`}>
            SHU · Scoville heat units
          </span>
          {showRowLabels && <span className={`${VALUE_W} shrink-0`} aria-hidden />}
        </div>
      )}

      <div className="space-y-3.5">
        {bands.map(({ variety, ghost }, i) => {
          const left = pct(variety.shuMin)
          const width = Math.max(pct(variety.shuMax) - left, 1.5)
          const delay = reduced ? 0 : i * STAGGER * 1.6

          return (
            <div key={variety.slug} className="flex items-center gap-4">
              {showRowLabels && (
                <span
                  className={`${LABEL_W} shrink-0 font-display text-sm ${
                    ghost
                      ? dark
                        ? 'text-navy-300/60'
                        : 'text-navy-500'
                      : dark
                        ? 'text-paper'
                        : 'text-navy-900'
                  }`}
                >
                  {variety.name}
                </span>
              )}

              <div className="relative h-5 flex-1">
                {/* Track */}
                <div
                  className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 ${
                    dark ? 'bg-paper/15' : 'bg-navy-200'
                  }`}
                />

                {/* Band */}
                <div
                  className="absolute top-1/2 h-3 -translate-y-1/2"
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  <div
                    data-grow-x=""
                    data-shown={inView ? '' : undefined}
                    style={
                      delay
                        ? ({ '--reveal-delay': `${Math.round(delay * 1000)}ms` } as React.CSSProperties)
                        : undefined
                    }
                    className={`relative h-full w-full origin-left rounded-[2px] ${
                      ghost
                        ? dark
                          ? 'bg-paper/15'
                          : 'bg-navy-200'
                        : dark
                          ? 'bg-navy-bar-dark'
                          : 'bg-navy-bar'
                    }`}
                  >
                    {/* Gold cap on the hot edge — the one accent. */}
                    {!ghost && (
                      <span className="absolute right-0 top-0 h-full w-[3px] rounded-r-[2px] bg-gold-500" />
                    )}
                  </div>
                </div>

                <span className="sr-only">
                  {variety.name}: {variety.shuLabel} Scoville heat units
                </span>
              </div>

              {showRowLabels && (
                <span
                  className={`${VALUE_W} shrink-0 text-right font-mono text-xs tabular-nums ${
                    ghost ? (dark ? 'text-navy-300/60' : 'text-navy-500') : dark ? 'text-navy-200' : 'text-navy-600'
                  }`}
                >
                  {variety.shuLabel}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {showAxis && (
        <div className="mt-4 flex items-start gap-4" aria-hidden>
          {showRowLabels && <span className={`${LABEL_W} shrink-0`} />}
          <div
            className={`relative h-4 flex-1 border-t pt-1.5 ${
              dark ? 'border-paper/15' : 'border-paper-line-strong'
            }`}
          >
            {AXIS_TICKS.map((t) => (
              <span
                key={t}
                className={`absolute top-1.5 -translate-x-1/2 font-mono text-[10px] tabular-nums first:translate-x-0 last:-translate-x-full ${
                  dark ? 'text-navy-300' : 'text-navy-500'
                }`}
                style={{ left: `${pct(t)}%` }}
              >
                {tickLabel(t)}
              </span>
            ))}
          </div>
          {showRowLabels && <span className={`${VALUE_W} shrink-0`} />}
        </div>
      )}
    </div>
  )
}
