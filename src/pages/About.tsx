import { Shell } from '../components/Shell'
import { PageHeader } from '../components/PageHeader'
import { Container, Section, SectionHeading } from '../components/Section'
import { Card } from '../components/Card'
import { ComplianceStrip } from '../components/ComplianceStrip'
import { Placeholder } from '../components/Placeholder'
import { CtaBand } from '../components/CtaBand'
import { TileLink } from '../components/TileLink'
import { Reveal } from '../components/motion/Reveal'
import { company } from '../data/company'
import { varieties } from '../data/varieties'
import { routes } from '../lib/routes'

// What the company does, stated as capability rather than history. There is no
// founding year, no tonnage, no client list and no testimonial anywhere on this
// page: MAVEH WORLD is a new exporter, and every line here has to survive a
// buyer checking it.
const whatWeDo = [
  {
    title: 'One product, properly specified',
    body: 'Dry red chilli only — Teja, Byadgi and Sannam S4. Each variety is offered against a written specification rather than a general description.',
  },
  {
    title: 'Prepared before it is packed',
    body: 'Cleaning, optical colour sorting, metal detection and moisture testing are applied to every lot, in the same order, before packing.',
  },
  {
    title: 'Built for bulk buyers',
    body: 'Importers, wholesalers, food manufacturers and distributors ordering from one metric tonne upward, on FOB, CIF, CFR or EXW terms.',
  },
]

export default function AboutPage() {
  return (
    <Shell current="about" overHero>
      <PageHeader
        eyebrow="About"
        title="MAVEH WORLD"
        intro={company.positioning}
        breadcrumb={[{ label: 'About' }]}
      />

      {/* What we do */}
      <Section>
        <Container>
          <SectionHeading eyebrow="What we do" title="A narrow business, done precisely" />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {whatWeDo.map((item, i) => (
              <Reveal key={item.title} index={i}>
                <Card className="h-full p-6 sm:p-7">
                  <span className="font-mono text-xs tabular-nums text-navy-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display text-xl leading-snug text-navy-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-500">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Registrations */}
      <Section className="border-t border-paper-line bg-paper-100">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading
                eyebrow="Registrations"
                title="Registered to export"
                intro="The registrations below are in place. Spices Board CRES and FSSAI are listed here as soon as their numbers are confirmed — until then they are not shown at all."
              />
              <Reveal className="mt-8">
                <ComplianceStrip />
              </Reveal>
              <Reveal delay={0.08}>
                <TileLink href={routes.quality.path}>How each lot is prepared</TileLink>
              </Reveal>
            </div>

            <Reveal delay={0.06}>
              <Placeholder label="Warehouse and packing floor" ratio="4 / 3" />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Company details */}
      <Section className="border-t border-paper-line">
        <Container>
          <SectionHeading eyebrow="Company" title="Details" />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal index={0}>
              <Card as="dl" className="h-full p-6">
                <dt className="label-mono">Registered address</dt>
                <dd className="mt-4 text-sm leading-relaxed text-navy-900">
                  {company.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  <span className="block">
                    {company.address.postalCode}, {company.address.country}
                  </span>
                </dd>
              </Card>
            </Reveal>

            <Reveal index={1}>
              <Card as="dl" className="h-full p-6">
                <dt className="label-mono">Product</dt>
                <dd className="mt-4 text-sm leading-relaxed text-navy-900">
                  Dry red chilli — {varieties.map((v) => v.name).join(', ')}.
                  <span className="mt-2 block font-mono tabular-nums text-navy-500">
                    HSN {varieties[0].hsn}
                  </span>
                </dd>
              </Card>
            </Reveal>

            <Reveal index={2}>
              <Card as="dl" className="h-full p-6">
                <dt className="label-mono">Minimum order</dt>
                <dd className="mt-4 font-display text-2xl tabular-nums text-navy-900">
                  {company.moqLabel}
                </dd>
              </Card>
            </Reveal>

            <Reveal index={3}>
              <Card as="dl" className="h-full p-6">
                <dt className="label-mono">Terms quoted</dt>
                <dd className="mt-4 font-mono text-sm text-navy-900">
                  {company.incoterms.join(' · ')}
                </dd>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </Shell>
  )
}
