import { Shell } from '../components/Shell'
import { PageHeader } from '../components/PageHeader'
import { Container, Section, SectionHeading } from '../components/Section'
import { VarietyCard } from '../components/VarietyCard'
import { TheScale } from '../components/TheScale'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { Reveal } from '../components/motion/Reveal'
import { company } from '../data/company'
import { varieties } from '../data/varieties'
import { routes, varietyPath } from '../lib/routes'
import type { Variety } from '../data/types'

interface CompareRow {
  label: string
  get: (v: Variety) => string
  mono?: boolean
}

// Rows every variety has a confirmed value for.
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

// Client-supplied fields. A row appears only when EVERY variety has the value —
// a table with two figures and one blank invites the reader to guess at the
// blank, which is worse than not showing the row at all.
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

export default function ProductsPage() {
  return (
    <Shell current="products" overHero>
      <PageHeader
        eyebrow="Products"
        title="Dry red chilli varieties"
        intro="Three varieties across the pungency range. Compare the specifications below, then open a variety for its full sheet and packing options."
        breadcrumb={[{ label: 'Products' }]}
      />

      {/* Cards */}
      <Section>
        <Container>
          {/* Keeps the heading order h1 → h2 → h3; the cards are h3. */}
          <h2 className="sr-only">Varieties</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {varieties.map((variety, i) => (
              <Reveal as="li" key={variety.slug} index={i} className="h-full">
                {/* Only the first card is eager: on this page the grid sits
                    directly under the masthead, so its lead image is the one
                    thing worth fetching ahead of a scroll. */}
                <VarietyCard variety={variety} index={i} priority={i === 0} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Compare */}
      <Section className="border-t border-paper-line bg-paper-100" id="compare">
        <Container>
          <SectionHeading
            eyebrow="Compare"
            title="All three, side by side"
            intro="The full specification for each variety in one view. Figures use tabular alignment so ranges compare cleanly."
          />

          {/* Pungency comparison */}
          <Reveal className="mt-12">
            <Card className="p-6 sm:p-8">
              <h3 className="font-display text-xl text-navy-900">Pungency comparison</h3>
              <div className="mt-8">
                <TheScale
                  bands={bands}
                  ariaLabel="Scoville range comparison for Teja, Byadgi and Sannam S4"
                />
              </div>
            </Card>
          </Reveal>

          {/* Specification table. The wrapper scrolls, not the page. */}
          <Reveal delay={0.08} className="mt-8">
            <div className="overflow-x-auto rounded-card border border-paper-line bg-paper-50 shadow-card">
              <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Specification comparison of Teja, Byadgi and Sannam S4 dry red chilli
                </caption>
                <thead>
                  <tr className="border-b border-paper-line bg-paper-100">
                    <th
                      scope="col"
                      className="sticky left-0 z-10 bg-paper-100 px-5 py-4 align-bottom"
                    >
                      <span className="label-mono">Specification</span>
                    </th>
                    {varieties.map((v) => (
                      <th key={v.slug} scope="col" className="px-5 py-4 align-bottom">
                        <a
                          href={varietyPath(v.slug)}
                          className="font-display text-lg text-navy-900 transition-colors hover:text-cyan-700"
                        >
                          {v.fullName}
                        </a>
                        <span className="mt-1 block font-mono text-[11px] uppercase tracking-label text-navy-500">
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
                        className="sticky left-0 z-10 bg-paper-50 px-5 py-4 align-top font-medium text-navy-500"
                      >
                        {row.label}
                      </th>
                      {varieties.map((v) => (
                        <td
                          key={v.slug}
                          className={`px-5 py-4 align-top text-navy-900 ${
                            row.mono ? 'font-mono tabular-nums' : ''
                          }`}
                        >
                          {row.get(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-paper-100">
                    <th scope="row" className="sticky left-0 z-10 bg-paper-100 px-5 py-4">
                      <span className="sr-only">Request a quote</span>
                    </th>
                    {varieties.map((v) => (
                      <td key={v.slug} className="px-5 py-4">
                        <Button
                          href={`${routes.contact.path}?variety=${v.slug}`}
                          size="sm"
                          variant="secondary"
                        >
                          Quote {v.name}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>

          <p className="mt-5 font-mono text-xs text-navy-500">
            All varieties: HSN {varieties[0].hsn} · minimum order {company.moqLabel} · moisture ≤ 12%
            · foreign matter max 1%.
          </p>
        </Container>
      </Section>

      <CtaBand />
    </Shell>
  )
}
