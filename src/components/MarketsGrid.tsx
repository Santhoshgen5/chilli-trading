import { company } from '../data/company'
import { Reveal } from './motion/Reveal'

/**
 * Export destinations.
 *
 * Every label on this grid describes reach — where we are set up to supply —
 * never a completed shipment. The company is a new exporter, so "markets
 * served", "we have shipped to" or any client count would not survive a buyer
 * checking it. The heading above this grid must say "Export destinations" or
 * "Markets we serve" for the same reason.
 *
 * The marker is the ISO country code rather than a flag emoji: flags do not
 * render as flags on Windows, where they degrade to a bare letter pair.
 */
export function MarketsGrid({ className = '' }: { className?: string }) {
  return (
    <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 ${className}`}>
      {company.markets.map((market, i) => (
        <Reveal as="li" key={market.code} index={i}>
          <div className="group flex h-full items-center gap-3.5 rounded-card border border-paper-line bg-paper-50 p-4 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lift">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy-700 font-mono text-xs font-medium tabular-nums text-paper"
            >
              {market.code}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-navy-900">
                {market.name}
              </span>
              <span className="mt-0.5 block truncate font-mono text-[11px] uppercase tracking-label text-navy-500">
                {market.region}
              </span>
            </span>
          </div>
        </Reveal>
      ))}
    </ul>
  )
}
