import type { Variety } from '../data/types'
import { heatLevel } from '../data/varieties'
import { varietyPath } from '../lib/routes'
import { Card } from './Card'
import { Badge, PungencyBadge } from './Badge'
import { TheScale } from './TheScale'

interface VarietyCardProps {
  variety: Variety
  /** Position in the row — sets the ordinal and the reveal stagger upstream. */
  index?: number
}

/**
 * Product card: identity, pungency, the SHU range as a figure and as a bar, and
 * what the variety is bought for.
 *
 * The SHU range appears twice on purpose — as a number for a buyer writing a
 * specification, and as a band for one comparing three varieties at a glance.
 */
export function VarietyCard({ variety, index = 0 }: VarietyCardProps) {
  const ordinal = String(index + 1).padStart(2, '0')

  return (
    <Card href={varietyPath(variety.slug)} className="h-full p-6 sm:p-7">
      {/* Gold hairline, drawn in on hover — the one accent. */}
      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px origin-left scale-x-0 bg-gold-rule transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs tabular-nums text-navy-500">{ordinal}</span>
        <PungencyBadge label={variety.pungency} level={heatLevel(variety)} />
      </div>

      <h3 className="mt-5 text-2xl text-navy-900 transition-colors duration-200 group-hover:text-navy-700">
        {variety.fullName}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-navy-500">{variety.summary}</p>

      {/* The figure, then the band. */}
      <div className="mt-7 rounded-lg border border-paper-line bg-paper px-4 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="label-mono">Scoville range</span>
          <span className="font-mono text-sm tabular-nums text-navy-900">
            {variety.shuLabel}
          </span>
        </div>
        <TheScale
          bands={[{ variety }]}
          showRowLabels={false}
          showAxis={false}
          className="mt-3"
          ariaLabel={`${variety.name} pungency: ${variety.shuLabel} Scoville heat units`}
        />
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {variety.applications.map((app) => (
          <li key={app}>
            <Badge>{app}</Badge>
          </li>
        ))}
      </ul>

      {/* Pushes the footer to the bottom so cards in a row line up. */}
      <span className="mt-auto" />

      <span className="mt-7 flex items-center justify-between border-t border-paper-line pt-5 font-mono text-xs uppercase tracking-label text-navy-600 transition-colors duration-200 group-hover:text-cyan-700">
        View specification
        <span
          aria-hidden
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Card>
  )
}
