import { Shell } from '../components/Shell'
import { Hero } from '../components/Hero'
import { Container, Section, SectionHeading } from '../components/Section'
import { VarietyCard } from '../components/VarietyCard'
import { StatBand } from '../components/StatBand'
import { ProcessTimeline } from '../components/ProcessTimeline'
import { MarketsGrid } from '../components/MarketsGrid'
import { ComplianceStrip } from '../components/ComplianceStrip'
import { CtaBand } from '../components/CtaBand'
import { TheScale } from '../components/TheScale'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { Reveal } from '../components/motion/Reveal'
import { TileLink } from '../components/TileLink'
import { company } from '../data/company'
import { varieties } from '../data/varieties'
import { routes } from '../lib/routes'

const bands = varieties.map((variety) => ({ variety }))

const regions = [...new Set(company.markets.map((market) => market.region))]

export default function HomePage() {
  return (
    <Shell current="home" overHero>
      <Hero />

      <StatBand />

      {/* Positioning */}
      <Section className="pb-0 pt-20 sm:pt-28">
        <Container>
          <Reveal>
            <p className="max-w-4xl text-balance text-2xl leading-snug text-navy-900 sm:text-3xl">
              {company.positioning}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Varieties */}
      <Section>
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Varieties"
              title="Three varieties, one specification standard"
            />
            <Reveal delay={0.1}>
              <TileLink href={routes.products.path}>Compare all three</TileLink>
            </Reveal>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {varieties.map((variety, i) => (
              <Reveal as="li" key={variety.slug} index={i} className="h-full">
                <VarietyCard variety={variety} index={i} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Bento — the comparison leads, the order terms sit around it */}
      <Section className="border-t border-paper-line pt-20 sm:pt-24">
        <Container>
          <SectionHeading eyebrow="At a glance" title="What you need to price an order" />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* Pungency comparison — the largest tile, and the most useful
                thing on the page */}
            <Reveal index={0} className="lg:col-span-2 lg:row-span-2">
              <Card className="h-full p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl text-navy-900">Pungency comparison</h3>
                  <span className="label-mono">Reference range</span>
                </div>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-navy-500">
                  Scoville heat units are directly comparable across varieties — read pungency at
                  a glance, then open a variety for its full specification.
                </p>
                <div className="mt-8">
                  <TheScale
                    bands={bands}
                    ariaLabel="Scoville range for Teja, Byadgi and Sannam S4"
                  />
                </div>
                <TileLink href={routes.products.path}>Full comparison table</TileLink>
              </Card>
            </Reveal>

            {/* MOQ — its own tile, so it can never be read as a bag size */}
            <Reveal index={1}>
              <Card surface="dark" className="h-full justify-center p-6 sm:p-8">
                <p className="label-mono-dark">Minimum order quantity</p>
                <p className="mt-4 font-display text-4xl tabular-nums text-paper sm:text-5xl">
                  {company.moqLabel}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-navy-200">
                  Orders start at one metric tonne. Mixed-variety loads can be arranged within a
                  single shipment.
                </p>
              </Card>
            </Reveal>

            {/* Packing formats — a separate tile from the MOQ above, never the
                same list */}
            <Reveal index={2}>
              <Card className="h-full p-6 sm:p-8">
                <h3 className="font-display text-xl text-navy-900">Packing formats</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {company.packingOptions.map((option) => (
                    <li key={option}>
                      <Badge>{option}</Badge>
                    </li>
                  ))}
                </ul>
                <TileLink href={routes.packaging.path}>Packaging and shipping</TileLink>
              </Card>
            </Reveal>

            {/* Registrations */}
            <Reveal index={3} className="lg:col-span-2">
              <Card className="h-full p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl text-navy-900">Registered to export</h3>
                  <span className="label-mono">Documentation</span>
                </div>
                <ComplianceStrip className="mt-6" />
                <p className="mt-5 max-w-prose text-sm leading-relaxed text-navy-500">
                  Further certifications are added here as documentation is confirmed.
                </p>
                <TileLink href={routes.about.path}>About the company</TileLink>
              </Card>
            </Reveal>

            {/* Destinations */}
            <Reveal index={4}>
              <Card className="h-full p-6 sm:p-8">
                <h3 className="font-display text-xl text-navy-900">Export destinations</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-500">
                  Regions we are set up to supply, across {company.markets.length} destinations.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <li key={region}>
                      <Badge dot>{region}</Badge>
                    </li>
                  ))}
                </ul>
                <TileLink href={routes.markets.path}>All destinations</TileLink>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section className="border-t border-paper-line bg-paper-100">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="Every lot follows the same seven steps"
            intro="A fixed sequence from sourcing to packing. The specification is checked against your order before dispatch."
          />
          <ProcessTimeline className="mt-14" />
          <Reveal delay={0.1}>
            <TileLink href={routes.quality.path}>Quality and process in full</TileLink>
          </Reveal>
        </Container>
      </Section>

      {/* Markets */}
      <Section className="border-t border-paper-line">
        <Container>
          <SectionHeading
            eyebrow="Reach"
            title="Markets we serve"
            intro="Destinations we are set up to supply. Contact us for shipping options to a destination not listed."
          />
          <MarketsGrid className="mt-12" />
        </Container>
      </Section>

      <CtaBand />
    </Shell>
  )
}
