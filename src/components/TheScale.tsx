import type { Variety } from '../data/types'
import { SHU_AXIS_MAX } from '../data/varieties'

// ── The Scale ────────────────────────────────────────────────────────────────
// The site's signature device: a Scoville (SHU) measure running 0 → 100,000 on
// which varieties are plotted as bands. Reads like a laboratory instrument, not
// produce decoration — and lets a buyer compare pungency at a glance.

const AXIS_TICKS = [0, 25000, 50000, 75000, 100000]

function pct(v: number): number {
  return Math.max(0, Math.min(100, (v / SHU_AXIS_MAX) * 100))
}

function tickLabel(v: number): string {
  return v === 0 ? '0' : `${v / 1000}k`
}

interface Band {
  variety: Variety
  /** Render faintly for context (not the focus of this scale). */
  ghost?: boolean
}

interface TheScaleProps {
  bands: Band[]
  /** Show the variety name + SHU value beside each track. Default true. */
  showRowLabels?: boolean
  /** Show the numeric tick axis. Default true. */
  showAxis?: boolean
  /** Animate band width on mount (respects prefers-reduced-motion via CSS). */
  animate?: boolean
  className?: string
  /** Accessible summary of what the scale shows. */
  ariaLabel?: string
}

// Fixed-width gutters keep the tick axis aligned with the band tracks.
const LABEL_W = 'w-16'
const VALUE_W = 'w-28'

export function TheScale({
  bands,
  showRowLabels = true,
  showAxis = true,
  animate = true,
  className = '',
  ariaLabel = 'Scoville heat scale',
}: TheScaleProps) {
  // role="img" prunes descendants from the a11y tree, so multi-band scales must
  // carry the SHU data in the label itself (single-band callers already do).
  const dataSummary = bands
    .map(({ variety }) => `${variety.name} ${variety.shuLabel} Scoville heat units`)
    .join('; ')
  const label = bands.length > 1 ? `${ariaLabel}. ${dataSummary}` : ariaLabel

  return (
    <div className={className} role="img" aria-label={label}>
      {showAxis && (
        <div className="mb-3 flex items-baseline gap-4">
          {showRowLabels && <span className={`${LABEL_W} shrink-0`} aria-hidden />}
          <span className="label-mono flex-1">SHU · Scoville heat units</span>
          {showRowLabels && <span className={`${VALUE_W} shrink-0`} aria-hidden />}
        </div>
      )}

      <div className="space-y-3">
        {bands.map(({ variety, ghost }) => {
          const left = pct(variety.shuMin)
          const width = Math.max(pct(variety.shuMax) - left, 1.5)
          return (
            <div key={variety.slug} className="flex items-center gap-4">
              {showRowLabels && (
                <span
                  className={`${LABEL_W} shrink-0 font-display text-sm ${
                    ghost ? 'text-navy-400/60' : 'text-navy-900'
                  }`}
                >
                  {variety.name}
                </span>
              )}

              <div className="relative h-5 flex-1">
                {/* Track baseline */}
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper-line" />
                {/* Band */}
                <div
                  className={`absolute top-1/2 h-3 -translate-y-1/2 origin-left ${
                    ghost ? 'bg-navy-400/25' : 'bg-navy-700'
                  } ${animate && !ghost ? 'animate-scale-grow' : ''}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  {/* Gold cap on the hot edge */}
                  {!ghost && (
                    <span className="absolute right-0 top-0 h-full w-1 bg-gold-500" />
                  )}
                </div>
                <span className="sr-only">
                  {variety.name}: {variety.shuLabel} Scoville heat units
                </span>
              </div>

              {showRowLabels && (
                <span
                  className={`${VALUE_W} shrink-0 text-right font-mono text-xs tabular-nums ${
                    ghost ? 'text-navy-400/60' : 'text-navy-500'
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
        <div className="mt-3 flex items-start gap-4" aria-hidden>
          {showRowLabels && <span className={`${LABEL_W} shrink-0`} />}
          <div className="relative h-4 flex-1 border-t border-paper-line pt-1.5">
            {AXIS_TICKS.map((t) => (
              <span
                key={t}
                className="absolute top-1.5 -translate-x-1/2 font-mono text-[10px] tabular-nums text-navy-400 first:translate-x-0 last:-translate-x-full"
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
