import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { Container, Section, SectionHeading } from '../components/Section'
import { Placeholder } from '../components/Placeholder'
import { CtaBand } from '../components/CtaBand'
import { company } from '../data/company'

const checks = [
  { label: 'Moisture', value: '≤ 12%', note: 'checked per lot' },
  { label: 'Foreign matter', value: 'Max 1%', note: 'after cleaning' },
  { label: 'Metal detection', value: 'Every lot', note: 'before packing' },
  { label: 'Colour sorting', value: 'Optical', note: 'off-colour removed' },
]

export default function Quality() {
  return (
    <>
      <Seo
        title="Quality & Process — How Each Lot Is Prepared | MAVEH WORLD"
        description="Sourcing, machine cleaning, colour sorting, metal detection, moisture testing, quality inspection and hygienic packing. Moisture below 12%, foreign matter under 1%, verified per lot."
        path="/quality"
      />

      <PageHeader
        eyebrow="Quality & Process"
        title="How each lot is prepared"
        intro="A fixed sequence from sourcing to packing. Every step is applied to every lot, and the specification is checked against your order before dispatch."
      />

      {/* Process sequence */}
      <Section>
        <Container>
          <ol className="grid gap-px overflow-hidden rounded-sm border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-1">
            {company.process.map((step, i) => (
              <li key={step.title} className="bg-white">
                <div className="flex gap-6 p-6 sm:p-8">
                  <span
                    aria-hidden
                    className="font-mono text-2xl tabular-nums text-gold-500"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-display text-xl text-navy-900">{step.title}</h2>
                    <p className="mt-2 max-w-prose text-navy-500">{step.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Checks */}
      <Section className="border-t border-paper-line bg-white">
        <Container>
          <SectionHeading
            eyebrow="What we verify"
            title="Checked, not claimed"
            intro="The figures we quote are the figures we test against. Lot-level results can be shared with your order."
          />
          <dl className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {checks.map((c) => (
              <div key={c.label} className="rounded-sm border border-paper-line p-6">
                <dt className="label-mono text-navy-500">{c.label}</dt>
                <dd className="mt-3 font-display text-3xl tabular-nums text-navy-900">{c.value}</dd>
                <p className="mt-1 font-mono text-xs text-navy-400">{c.note}</p>
              </div>
            ))}
          </dl>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <Placeholder label="Colour sorting line" ratio="16 / 10" />
            <Placeholder label="Metal detection & packing" ratio="16 / 10" />
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Ask for the specification"
        body="Tell us the variety and destination. We send the specification we test against, with pricing."
      />
    </>
  )
}
