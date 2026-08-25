import { Shell } from '../components/Shell'
import { PageHeader } from '../components/PageHeader'
import { Container, Section, SectionHeading } from '../components/Section'
import { Card } from '../components/Card'
import { CtaBand } from '../components/CtaBand'
import { Reveal } from '../components/motion/Reveal'
import { company } from '../data/company'

// Grouped by region, in the order the regions first appear in the data.
const byRegion = company.markets.reduce<Record<string, typeof company.markets>>(
  (acc, market) => {
    ;(acc[market.region] ??= []).push(market)
    return acc
  },
  {},
)

const regions = Object.entries(byRegion)

export default function MarketsPage() {
  return (
    <Shell current="markets" overHero>
      {/*
        Every line on this page describes reach, not history. MAVEH WORLD is a
        new exporter: "markets served" means destinations we are set up to
        supply. Nothing here may be rewritten as countries already shipped to.
      */}
      <PageHeader
        eyebrow="Export destinations"
        title="Markets we serve"
        intro="Destinations we are set up to supply, grouped by region. If your destination is not listed, ask — shipping can usually be arranged."
        breadcrumb={[{ label: 'Export destinations' }]}
      />

      <Section>
        <Container>
          <div className="space-y-12">
            {regions.map(([region, markets], regionIndex) => (
              <div key={region}>
                <Reveal>
                  <div className="flex items-baseline gap-4">
                    <h2 className="font-display text-xl text-navy-900">{region}</h2>
                    <span aria-hidden className="h-px flex-1 bg-paper-line" />
                    <span className="font-mono text-xs tabular-nums text-navy-500">
                      {markets.length}
                    </span>
                  </div>
                </Reveal>

                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {markets.map((market, i) => (
                    <Reveal as="li" key={market.code} index={regionIndex + i}>
                      {/* The row lives in an inner div: Card is `flex-col` by
                          default, and a `flex-row` utility passed through
                          className would depend on Tailwind's output order to
                          win, which is not something to rely on. */}
                      <Card className="h-full p-5" interactive>
                        <span className="flex items-center gap-4">
                          <span
                            aria-hidden
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-700 font-mono text-xs font-medium tabular-nums text-paper"
                          >
                            {market.code}
                          </span>
                          <span className="min-w-0 text-sm font-medium text-navy-900">
                            {market.name}
                          </span>
                        </span>
                      </Card>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-paper-line bg-paper-100">
        <Container>
          <SectionHeading
            eyebrow="Not listed?"
            title="Ask about your destination"
            intro="These are the destinations we are currently set up to supply. Send your port and quantity and we will confirm whether we can ship to you and on what terms."
          />
        </Container>
      </Section>

      <CtaBand
        title="Tell us where it is going"
        body="Send your destination port, quantity in MT and preferred packing. We reply with pricing on your Incoterm."
      />
    </Shell>
  )
}
