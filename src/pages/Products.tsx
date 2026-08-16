import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { Container, Section, SectionHeading } from '../components/Section'
import { VarietyCard } from '../components/VarietyCard'
import { TheScale } from '../components/TheScale'
import { Button } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { company } from '../data/company'
import { varieties } from '../data/varieties'
import type { Variety } from '../data/types'

interface CompareRow {
  label: string
  get: (v: Variety) => string
  mono?: boolean
}

// Rows always present (every variety has a confirmed value).
const baseRows: CompareRow[] = [
  { label: 'Pungency', get: (v) => v.pungency },
  { label: 'Scoville (SHU)', get: (v) => `${v.shuLabel} SHU`, mono: true },
  { label: 'Colour', get: (v) => v.colour },
  { label: 'Moisture', get: (v) => v.moisture, mono: true },
  { label: 'Foreign matter', get: (v) => v.foreignMatter, mono: true },
  { label: 'Form', get: (v) => v.form },
  { label: 'HSN code', get: (v) => v.hsn, mono: true },
  { label: 'Best suited for', get: (v) => v.bestSuitedFor },
]

// Optional rows: shown only when EVERY variety has the value (no invented gaps).
const optionalRows: { label: string; key: 'astaColour' | 'aflatoxin'; mono?: boolean }[] = [
  { label: 'ASTA colour', key: 'astaColour', mono: true },
  { label: 'Aflatoxin', key: 'aflatoxin' },
]

const rows: CompareRow[] = [
  ...baseRows,
  ...optionalRows
    .filter((r) => varieties.every((v) => v[r.key] !== null))
    .map((r) => ({ label: r.label, get: (v: Variety) => v[r.key] as string, mono: r.mono })),
]

const bands = varieties.map((variety) => ({ variety }))

export default function Products() {
  return (
    <>
      <Seo
        title="Products — Teja, Byadgi & Sannam S4 Dry Red Chilli | MAVEH WORLD"
        description="Compare Teja, Byadgi and Sannam S4 dry red chilli side by side: Scoville range, colour, moisture, foreign matter and form. HSN 09042110. Minimum order 1 MT."
        path="/products"
      />

      <PageHeader
        eyebrow="Products"
        title="Dry red chilli varieties"
        intro="Three varieties across the pungency range. Compare the specifications below, then open a variety for its full sheet and packing options."
      />

      {/* Cards */}
      <Section>
        <Container>
          {/* sr-only h2 keeps the heading order h1 -> h2 -> h3 (cards are h3). */}
          <h2 className="sr-only">Varieties</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {varieties.map((variety) => (
              <VarietyCard key={variety.slug} variety={variety} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Compare */}
      <Section className="border-t border-paper-line bg-white" id="compare">
        <Container>
          <SectionHeading
            eyebrow="Compare"
            title="All three, side by side"
            intro="The full specification for each variety in one view. Figures use tabular alignment so ranges compare cleanly."
          />

          {/* Pungency comparison — the Scale */}
          <div className="mt-10 rounded-sm border border-paper-line p-6 sm:p-8">
            <h3 className="font-mono text-xs uppercase tracking-label text-navy-500">
              Pungency comparison
            </h3>
            <div className="mt-6">
              <TheScale bands={bands} ariaLabel="Scoville range comparison for all three varieties" />
            </div>
          </div>

          {/* Comparison table */}
          <div className="mt-8 overflow-x-auto rounded-sm border border-paper-line">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Specification comparison of Teja, Byadgi and Sannam S4 dry red chilli
              </caption>
              <thead>
                <tr className="border-b border-paper-line bg-paper">
                  <th scope="col" className="sticky left-0 z-10 bg-paper px-5 py-4 align-bottom">
                    <span className="label-mono">Specification</span>
                  </th>
                  {varieties.map((v) => (
                    <th key={v.slug} scope="col" className="px-5 py-4 align-bottom">
                      <Link to={`/products/${v.slug}`} className="font-display text-lg text-navy-900 hover:text-cyan-700">
                        {v.fullName}
                      </Link>
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-label text-navy-400">
                        {v.pungency}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-paper-line last:border-b-0">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-5 py-4 align-top font-medium text-navy-400"
                    >
                      {row.label}
                    </th>
                    {varieties.map((v) => (
                      <td
                        key={v.slug}
                        className={`px-5 py-4 align-top text-navy-900 ${row.mono ? 'font-mono tabular-nums' : ''}`}
                      >
                        {row.get(v)}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Action row */}
                <tr className="bg-paper">
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-5 py-4">
                    <span className="sr-only">Request a quote</span>
                  </th>
                  {varieties.map((v) => (
                    <td key={v.slug} className="px-5 py-4">
                      <Button to={`/enquiry?variety=${v.slug}`} size="md" variant="secondary">
                        Quote {v.name}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 font-mono text-xs text-navy-400">
            All varieties: HSN {varieties[0].hsn} · MOQ {company.moqLabel} · moisture ≤ 12% · foreign matter max 1%.
          </p>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
