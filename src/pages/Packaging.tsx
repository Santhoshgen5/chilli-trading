import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { Container, Section, SectionHeading } from '../components/Section'
import { Placeholder } from '../components/Placeholder'
import { CtaBand } from '../components/CtaBand'
import { company } from '../data/company'

// Available packing formats — deliberately described separately from the MOQ.
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

export default function Packaging() {
  return (
    <>
      <Seo
        title="Packaging & Shipping — PP, Jute & Vacuum | MOQ 1 MT | MAVEH WORLD"
        description="Packing in 5–50 kg PP bags, jute bags and vacuum packing. Minimum order quantity 1 MT (1,000 kg). Incoterms: FOB, CIF, CFR, EXW."
        path="/packaging"
      />

      <PageHeader
        eyebrow="Packaging & Shipping"
        title="Packing and order terms"
        intro="Choose the packing format that suits your line. The minimum order quantity is a separate figure — it is not one of the bag sizes."
      />

      {/* MOQ — deliberately prominent and on its own */}
      <Section className="pb-0">
        <Container>
          <div className="rounded-sm border border-navy-700 bg-navy-700 p-8 text-paper sm:p-12">
            <p className="label-mono text-paper/60">Minimum order quantity</p>
            <p className="mt-3 font-display text-5xl tabular-nums sm:text-6xl">{company.moqLabel}</p>
            <p className="mt-4 max-w-xl text-paper/70">
              Orders start at one metric tonne. This is the smallest quantity we ship — it
              is not related to bag size. A single shipment can combine varieties.
            </p>
          </div>
        </Container>
      </Section>

      {/* Available packing */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Available packing"
            title="Bag options"
            intro="Packing formats you can choose for your order — separate from the minimum order quantity above."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {packing.map((p) => (
              <div key={p.name} className="rounded-sm border border-paper-line bg-white p-6">
                <h3 className="font-display text-xl text-navy-900">{p.name}</h3>
                <p className="mt-2 text-sm text-navy-500">{p.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-xs text-navy-400">
            Formats: {company.packingOptions.join(' · ')}
          </p>
        </Container>
      </Section>

      {/* Shipping terms */}
      <Section className="border-t border-paper-line bg-white">
        <Container>
          <SectionHeading
            eyebrow="Shipping"
            title="Terms we quote on"
            intro="State your preferred Incoterm with your enquiry and we quote accordingly."
          />
          <dl className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {company.incoterms.map((code) => (
              <div key={code} className="rounded-sm border border-paper-line p-6">
                <dt className="font-display text-2xl text-navy-900">{code}</dt>
                <dd className="mt-2 font-mono text-xs uppercase tracking-label text-navy-400">
                  {incotermNames[code]}
                </dd>
              </div>
            ))}
          </dl>

          {/* Ports — client-supplied placeholder. Renders only when provided. */}
          {company.ports && (
            <div className="mt-10">
              <h3 className="label-mono text-navy-500">Ports of loading</h3>
              <p className="mt-3 text-navy-900">{company.ports}</p>
            </div>
          )}

          <div className="mt-10">
            <Placeholder label="Palletised bags, ready for loading" ratio="21 / 9" />
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Request a quote"
        body="Send your destination port, quantity in MT and preferred packing. We reply with pricing on your Incoterm."
      />
    </>
  )
}
