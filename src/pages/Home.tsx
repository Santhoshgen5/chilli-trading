import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { Container, Section, SectionHeading, Eyebrow } from '../components/Section'
import { Button } from '../components/Button'
import { TheScale } from '../components/TheScale'
import { VarietyCard } from '../components/VarietyCard'
import { ComplianceStrip } from '../components/ComplianceStrip'
import { CtaBand } from '../components/CtaBand'
import { company } from '../data/company'
import { varieties, HSN_CODE } from '../data/varieties'

const bands = varieties.map((variety) => ({ variety }))

export default function Home() {
  return (
    <>
      <Seo
        title="MAVEH WORLD — Dry Red Chilli Exporter | Teja, Byadgi, Sannam S4"
        description="Indian exporter of dry red chilli — Teja, Byadgi and Sannam S4. Specified per lot: SHU, moisture below 12%, foreign matter under 1%. Minimum order 1 MT."
        path="/"
      />

      {/* Hero */}
      <Section className="pt-14 sm:pt-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <Eyebrow>Dry red chilli exporter · Thanjavur, India</Eyebrow>
              <h1 className="mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                {company.tagline}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-500">
                Teja, Byadgi and Sannam S4 for bulk buyers. Cleaned, colour-sorted and
                checked against a written specification before packing.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to="/enquiry" size="lg">Request a quote</Button>
                <Button to="/products" size="lg" variant="secondary">View products</Button>
              </div>

              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-paper-line pt-6">
                <div>
                  <dt className="label-mono">MOQ</dt>
                  <dd className="mt-1 font-mono text-sm tabular-nums text-navy-900">1 MT</dd>
                </div>
                <div>
                  <dt className="label-mono">Moisture</dt>
                  <dd className="mt-1 font-mono text-sm tabular-nums text-navy-900">≤ 12%</dd>
                </div>
                <div>
                  <dt className="label-mono">HSN</dt>
                  <dd className="mt-1 font-mono text-sm tabular-nums text-navy-900">{HSN_CODE}</dd>
                </div>
              </dl>
            </div>

            {/* The Scale — signature device */}
            <div className="rounded-sm border border-paper-line bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="font-mono text-xs uppercase tracking-label text-navy-500">
                  Pungency by variety
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-label text-navy-400">
                  Reference range
                </span>
              </div>
              <TheScale bands={bands} ariaLabel="Scoville range for Teja, Byadgi and Sannam S4" />
              <p className="mt-6 border-t border-paper-line pt-4 text-sm text-navy-500">
                Scoville heat units are directly comparable across varieties — read
                pungency at a glance, then open a variety for its full specification.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Positioning */}
      <Section className="border-t border-paper-line bg-white py-16 sm:py-20">
        <Container>
          <p className="max-w-3xl text-balance text-2xl leading-snug text-navy-900 sm:text-3xl">
            {company.positioning}
          </p>
        </Container>
      </Section>

      {/* Varieties */}
      <Section>
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Varieties" title="Three varieties, one specification standard" />
            <Link
              to="/products"
              className="font-mono text-xs uppercase tracking-label text-navy-700 hover:text-cyan-700"
            >
              Compare all three →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {varieties.map((variety) => (
              <VarietyCard key={variety.slug} variety={variety} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Compliance */}
      <Section className="border-t border-paper-line bg-white">
        <Container>
          <SectionHeading
            eyebrow="Registrations"
            title="Registered to export"
            intro="Additional certifications are being added as documentation is confirmed."
          />
          <ComplianceStrip className="mt-8" />
        </Container>
      </Section>

      {/* Packaging + MOQ */}
      <Section className="border-t border-paper-line">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Packaging" title="Packing to your order" />
              <p className="mt-4 max-w-prose text-navy-500">
                Available packing formats. Minimum order quantity is stated separately —
                it is not a bag size.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {company.packingOptions.map((opt) => (
                  <li
                    key={opt}
                    className="rounded-sm border border-paper-line bg-white px-3 py-1.5 font-mono text-xs text-navy-700"
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              <Link
                to="/packaging"
                className="mt-6 inline-block font-mono text-xs uppercase tracking-label text-navy-700 hover:text-cyan-700"
              >
                Packaging &amp; shipping →
              </Link>
            </div>

            <div className="flex flex-col justify-center rounded-sm border border-navy-700 bg-navy-700 p-8 text-paper">
              <p className="label-mono text-paper/60">Minimum order quantity</p>
              <p className="mt-3 font-display text-4xl tabular-nums sm:text-5xl">{company.moqLabel}</p>
              <p className="mt-4 text-sm text-paper/70">
                Orders start at one metric tonne. Mixed-variety loads can be arranged
                within a single shipment.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Markets */}
      <Section className="border-t border-paper-line bg-white">
        <Container>
          <SectionHeading
            eyebrow="Export destinations"
            title="Markets we serve"
            intro="Regions we are set up to supply. Contact us for shipping options to a destination not listed."
          />
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
            {company.markets.map((m) => (
              <li key={m} className="flex items-center gap-2 border-t border-paper-line pt-3 text-sm text-navy-700">
                <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                {m}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
