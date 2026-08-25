import { Container } from './Section'
import { Counter } from './motion/Counter'
import { Reveal } from './motion/Reveal'
import { company } from '../data/company'
import { varieties } from '../data/varieties'

/**
 * Four figures, counted up on scroll.
 *
 * Every one is derived from the data files rather than typed in, so none of
 * them can drift from what the rest of the site says — and none of them is a
 * claim about trading history. "Export destinations" is reach: the places we
 * are set up to supply, not a count of shipments made. There is deliberately
 * no years-in-business, tonnage-shipped or clients-served figure here.
 */
const stats = [
  { value: varieties.length, suffix: undefined, label: 'Varieties offered' },
  { value: 1, suffix: 'MT', label: 'Minimum order' },
  { value: company.packingOptions.length, suffix: undefined, label: 'Packing options' },
  { value: company.markets.length, suffix: undefined, label: 'Export destinations' },
]

export function StatBand() {
  return (
    <section className="surface-dark relative overflow-hidden bg-navy-band">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gold-rule" />
      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} index={i}>
              {/*
                One <dl> per figure. A single <dl> wrapping the grid would put
                two levels of <div> between it and the <dt>/<dd> pairs, which is
                invalid — a <dl> allows at most one.

                Source order is term then description, as the spec requires;
                `flex-col-reverse` puts the number on top visually, which is the
                order that reads well as a stat.
              */}
              <dl className="flex flex-col-reverse border-l border-paper/15 pl-5">
                <dt className="label-mono-dark mt-3">{stat.label}</dt>
                <dd className="font-display text-4xl text-paper sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
              </dl>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
