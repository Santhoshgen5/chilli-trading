import { Shell } from '../components/Shell'
import { PageHeader } from '../components/PageHeader'
import { Container, Section, SectionHeading } from '../components/Section'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { Placeholder } from '../components/Placeholder'
import { CtaBand } from '../components/CtaBand'
import { Reveal } from '../components/motion/Reveal'
import { company } from '../data/company'

// Packing formats, described separately from the minimum order quantity. These
// two figures are never presented as one list — a buyer who reads "1 MT" as a
// bag size has been actively misled.
const packing = [
  { name: 'PP bags', detail: 'Polypropylene woven bags in 5 kg, 25 kg and 50 kg.' },
  { name: 'Jute bags', detail: 'Traditional jute sacks where preferred.' },
  { name: 'Vacuum packing', detail: 'Vacuum packing available on request.' },
]

const incotermNames: Record<string, string> = {
  FOB: 'Free On Board',
  CIF: 'Cost, Insurance & Freight',
  CFR: 'Cost & Freight',
  EXW: 'Ex Works',
}

export default function PackagingPage() {
  return (
    <Shell current="packaging" overHero>
      <PageHeader
        eyebrow="Packaging & shipping"
        title="Packing and order terms"
        intro="Choose the packing format that suits your line. The minimum order quantity is a separate figure — it is not one of the bag sizes."
        breadcrumb={[{ label: 'Packaging & shipping' }]}
      />

      {/* MOQ — deliberately alone, at a size that cannot be mistaken for a bag */}
      <Section className="pb-0">
        <Container>
          <Reveal>
            <Card surface="dark" className="p-8 sm:p-12">
              <p className="label-mono-dark">Minimum order quantity</p>
              <p className="mt-4 font-display text-5xl tabular-nums text-paper sm:text-6xl">
                {company.moqLabel}
              </p>
              <p className="mt-5 max-w-xl leading-relaxed text-navy-200">
                Orders start at one metric tonne. This is the smallest quantity we ship — it is
                not related to bag size. A single shipment can combine varieties.
              </p>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* Packing formats */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Available packing"
            title="Bag options"
            intro="Packing formats you can choose for your order — separate from the minimum order quantity above."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {packing.map((option, i) => (
              <Reveal key={option.name} index={i}>
                <Card className="h-full p-6 sm:p-7">
                  <h3 className="font-display text-xl text-navy-900">{option.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-500">{option.detail}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {company.packingOptions.map((format) => (
                <li key={format}>
                  <Badge>{format}</Badge>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* Shipping terms */}
      <Section className="border-t border-paper-line bg-paper-100">
        <Container>
          <SectionHeading
            eyebrow="Shipping"
            title="Terms we quote on"
            intro="State your preferred Incoterm with your enquiry and we quote accordingly."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.incoterms.map((code, i) => (
              <Reveal key={code} index={i}>
                <Card as="dl" className="h-full p-6">
                  <dt className="font-display text-2xl text-navy-900">{code}</dt>
                  <dd className="mt-3 font-mono text-xs uppercase tracking-label text-navy-500">
                    {incotermNames[code]}
                  </dd>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* Ports of loading — rendered only once the client supplies them.
              TODO in src/data/company.ts → ports. */}
          {company.ports && (
            <Reveal className="mt-12">
              <h3 className="label-mono">Ports of loading</h3>
              <p className="mt-4 text-navy-900">{company.ports}</p>
            </Reveal>
          )}

          <Reveal className="mt-12">
            <Placeholder label="Palletised bags, ready for loading" ratio="21 / 9" />
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Request a quote"
        body="Send your destination port, quantity in MT and preferred packing. We reply with pricing on your Incoterm."
      />
    </Shell>
  )
}
