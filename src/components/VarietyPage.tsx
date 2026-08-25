import { Shell } from './Shell'
import { PageHeader } from './PageHeader'
import { Container, Section } from './Section'
import { Button } from './Button'
import { Card } from './Card'
import { Badge, PungencyBadge } from './Badge'
import { TheScale } from './TheScale'
import { SpecTable } from './SpecTable'
import { ProductImage } from './ProductImage'
import { WhatsAppIcon } from './WhatsAppIcon'
import { CtaBand } from './CtaBand'
import { Reveal } from './motion/Reveal'
import { whatsappLink } from '../lib/whatsapp'
import { company } from '../data/company'
import { varieties, heatLevel } from '../data/varieties'
import { routes, varietyPath } from '../lib/routes'
import type { Variety } from '../data/types'

/**
 * Shared detail page for a single variety. The three variety routes are thin
 * wrappers around this, so the layout stays identical between them and the
 * differences are all data.
 */
export function VarietyPage({ variety }: { variety: Variety }) {
  // Selected variety solid, the other two ghosted, so the reader can see where
  // this one sits without leaving the page.
  const bands = varieties.map((v) => ({ variety: v, ghost: v.slug !== variety.slug }))
  const others = varieties.filter((v) => v.slug !== variety.slug)
  const quoteHref = `${routes.contact.path}?variety=${variety.slug}`

  return (
    <Shell current="products" overHero>
      <PageHeader
        eyebrow={`${variety.pungency} pungency`}
        title={variety.fullName}
        intro={variety.summary}
        breadcrumb={[
          { label: 'Products', href: routes.products.path },
          { label: variety.name },
        ]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <PungencyBadge label={variety.pungency} level={heatLevel(variety)} tone="dark" />
          <Badge tone="on-dark">
            <span className="font-mono tabular-nums">{variety.shuLabel} SHU</span>
          </Badge>
          <Badge tone="on-dark">
            <span className="font-mono tabular-nums">HSN {variety.hsn}</span>
          </Badge>
        </div>
      </PageHeader>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            {/* Main column */}
            <div>
              <Reveal>
                <Card className="p-6 sm:p-8">
                  <h2 className="label-mono">Best suited for</h2>
                  <p className="mt-4 text-lg leading-relaxed text-navy-900">
                    {variety.bestSuitedFor}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {variety.applications.map((tag) => (
                      <li key={tag}>
                        <Badge>{tag}</Badge>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>

              <Reveal delay={0.06} className="mt-12">
                <h2 className="text-2xl text-navy-900">Specification</h2>
                <SpecTable variety={variety} className="mt-5" />
                <p className="mt-4 font-mono text-xs text-navy-500">
                  Lot-level results can be shared with your order.
                </p>
              </Reveal>

              <Reveal delay={0.06} className="mt-12">
                <h2 className="text-2xl text-navy-900">Available packing</h2>
                {/* MOQ is stated as its own sentence, never as an item in the
                    packing list below. */}
                <p className="mt-3 text-sm text-navy-500">
                  Minimum order quantity is {company.moqLabel} — a separate figure from the bag
                  sizes below.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {variety.packing.map((format) => (
                    <li key={format}>
                      <Badge>{format}</Badge>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/*
              Aside. On desktop it sticks, so the photograph stays in view while
              the specification scrolls past it. On a phone the grid collapses
              and this column follows the main one, which puts the specification
              table above the photograph — the right order when the specification
              is what the reader came for.
            */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <figure className="overflow-hidden rounded-card border border-paper-line bg-navy-100 shadow-card">
                  <div className="aspect-[4/5] w-full">
                    <ProductImage
                      image={variety.image}
                      alt={variety.imageAlt}
                      crop="detail"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  </div>
                </figure>
              </Reveal>

              <Reveal delay={0.06}>
                <Card className="mt-6 p-6 sm:p-8">
                  <h2 className="label-mono">Where it sits</h2>
                  <div className="mt-7">
                    <TheScale
                      bands={bands}
                      ariaLabel={`${variety.name} on the Scoville scale relative to the other varieties`}
                    />
                  </div>
                </Card>
              </Reveal>

              <Reveal delay={0.1}>
                <Card surface="dark" className="mt-6 p-6 sm:p-8">
                  <p className="label-mono-dark">Order this variety</p>
                  <p className="mt-3 font-mono text-sm tabular-nums text-navy-200">
                    {variety.shuLabel} SHU · HSN {variety.hsn}
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <Button href={quoteHref} size="lg" variant="on-dark">
                      Request a quote
                    </Button>
                    <Button
                      href={whatsappLink(
                        `Hello MAVEH WORLD. I would like a quote for ${variety.fullName} dry red chilli.`,
                      )}
                      external
                      variant="on-dark-outline"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      WhatsApp us
                    </Button>
                  </div>
                </Card>
              </Reveal>
            </aside>
          </div>

          {/* Other varieties */}
          <div className="mt-20 border-t border-paper-line pt-12">
            <h2 className="label-mono">Other varieties</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {others.map((v, i) => (
                <Reveal as="li" key={v.slug} index={i}>
                  <a
                    href={varietyPath(v.slug)}
                    className="group flex items-center justify-between gap-4 rounded-card border border-paper-line bg-paper-50 px-5 py-4 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lift"
                  >
                    <span>
                      <span className="font-display text-lg text-navy-900">{v.fullName}</span>
                      <span className="ml-3 font-mono text-xs tabular-nums text-navy-500">
                        {v.shuLabel} SHU
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-navy-600 transition-transform duration-300 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaBand variety={variety.slug} varietyName={variety.fullName} />
    </Shell>
  )
}
