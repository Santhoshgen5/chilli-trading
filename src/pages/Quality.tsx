import { Shell } from '../components/Shell'
import { PageHeader } from '../components/PageHeader'
import { Container, Section, SectionHeading } from '../components/Section'
import { ProcessTimeline } from '../components/ProcessTimeline'
import { ComplianceStrip } from '../components/ComplianceStrip'
import { Placeholder } from '../components/Placeholder'
import { Card } from '../components/Card'
import { CtaBand } from '../components/CtaBand'
import { Reveal } from '../components/motion/Reveal'

// The figures we test against. Nothing here is a claim we cannot show a buyer
// a lot-level result for.
const checks = [
  { label: 'Moisture', value: '≤ 12%', note: 'checked per lot' },
  { label: 'Foreign matter', value: 'Max 1%', note: 'after cleaning' },
  { label: 'Metal detection', value: 'Every lot', note: 'before packing' },
  { label: 'Colour sorting', value: 'Optical', note: 'off-colour removed' },
]

export default function QualityPage() {
  return (
    <Shell current="quality" overHero>
      <PageHeader
        eyebrow="Quality & process"
        title="How each lot is prepared"
        intro="A fixed sequence from sourcing to packing. Every step is applied to every lot, and the specification is checked against your order before dispatch."
        breadcrumb={[{ label: 'Quality & process' }]}
      />

      {/* Process */}
      <Section>
        <Container>
          <h2 className="sr-only">Process</h2>
          <ProcessTimeline />
        </Container>
      </Section>

      {/* Checks */}
      <Section className="border-t border-paper-line bg-paper-100">
        <Container>
          <SectionHeading
            eyebrow="What we verify"
            title="Checked, not claimed"
            intro="The figures we quote are the figures we test against. Lot-level results can be shared with your order."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {checks.map((check, i) => (
              <Reveal key={check.label} index={i}>
                <Card as="dl" className="h-full p-6">
                  <dt className="label-mono">{check.label}</dt>
                  <dd className="mt-4">
                    <span className="block font-display text-3xl tabular-nums text-navy-900">
                      {check.value}
                    </span>
                    <span className="mt-2 block font-mono text-xs text-navy-500">
                      {check.note}
                    </span>
                  </dd>
                </Card>
              </Reveal>
            ))}
          </div>

          {/*
            ASTA colour and aflatoxin limits are not published here yet — the
            client has not supplied figures or a testing lab. See the TODO
            markers in src/data/varieties.ts. Nothing stands in for them.
          */}

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Reveal index={0}>
              <Placeholder label="Colour sorting line" ratio="16 / 10" />
            </Reveal>
            <Reveal index={1}>
              <Placeholder label="Metal detection and packing" ratio="16 / 10" />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Registrations */}
      <Section className="border-t border-paper-line">
        <Container>
          <SectionHeading
            eyebrow="Registrations"
            title="Registered to export"
            intro="Further certifications are added here as documentation is confirmed."
          />
          <Reveal className="mt-8">
            <ComplianceStrip />
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Ask for the specification"
        body="Tell us the variety and destination. We send the specification we test against, with pricing."
      />
    </Shell>
  )
}
