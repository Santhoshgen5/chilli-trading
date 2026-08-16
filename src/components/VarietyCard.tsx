import { Link } from 'react-router-dom'
import type { Variety } from '../data/types'
import { TheScale } from './TheScale'

/** Product card: name, pungency, one-line summary and a compact SHU scale. */
export function VarietyCard({ variety }: { variety: Variety }) {
  return (
    <Link
      to={`/products/${variety.slug}`}
      className="group flex flex-col rounded-sm border border-paper-line bg-white p-6 transition-colors hover:border-navy-400/60"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl">{variety.fullName}</h3>
        <span className="font-mono text-[11px] uppercase tracking-label text-navy-400">
          {variety.pungency}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-navy-500">{variety.summary}</p>

      <div className="mt-6">
        <TheScale
          bands={[{ variety }]}
          showRowLabels={false}
          ariaLabel={`${variety.name} pungency: ${variety.shuLabel} Scoville heat units`}
        />
      </div>

      <span className="mt-6 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-label text-navy-700 transition-colors group-hover:text-cyan-700">
        View specification
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  )
}
