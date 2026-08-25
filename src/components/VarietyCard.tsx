import type { Variety } from '../data/types'
import { heatLevel } from '../data/varieties'
import { varietyPath } from '../lib/routes'
import { Card } from './Card'
import { Badge, PungencyBadge } from './Badge'
import { ProductImage } from './ProductImage'
import { TheScale } from './TheScale'

interface VarietyCardProps {
  variety: Variety
  /** Position in the row — sets the ordinal and the reveal stagger upstream. */
  index?: number
  /**
   * Eager-load this card's photograph. Set it only on the first card of a grid
   * that is actually above the fold — on the home page the cards sit well below
   * the hero, and racing the hero for bandwidth would cost LCP for nothing.
   */
  priority?: boolean
}

/**
 * Product card: photograph, identity, pungency, the SHU range as a figure and
 * as a bar, and what the variety is bought for.
 *
 * The photograph is the lead-in, not the substance — it earns a glance, then
 * the specification does the work. The SHU range appears twice on purpose: as
 * a number for a buyer writing a specification, and as a band for one comparing
 * three varieties at once.
 */
export function VarietyCard({ variety, index = 0, priority = false }: VarietyCardProps) {
  const ordinal = String(index + 1).padStart(2, '0')

  return (
    <Card href={varietyPath(variety.slug)} className="h-full overflow-hidden">
      {/* Photograph. `overflow-hidden` on the frame keeps the hover scale
          inside the card's rounded corners. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-100">
        <ProductImage
          image={variety.image}
          alt={variety.imageAlt}
          crop="card"
          priority={priority}
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {/* Navy wash on hover, tying the photograph to the palette. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-navy-900/0 transition-colors duration-500 ease-out group-hover:bg-navy-900/[0.08]"
        />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold-rule transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
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

        {/* Pushes the footer down so cards in a row line up. */}
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
      </div>
    </Card>
  )
}
