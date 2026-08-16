import { useParams, Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { Container, Section } from '../components/Section'
import { Button } from '../components/Button'
import { TheScale } from '../components/TheScale'
import { SpecTable } from '../components/SpecTable'
import { Placeholder } from '../components/Placeholder'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { CtaBand } from '../components/CtaBand'
import { whatsappLink } from '../lib/whatsapp'
import { company } from '../data/company'
import { varieties, getVariety } from '../data/varieties'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const variety = slug ? getVariety(slug) : undefined

  if (!variety) return <NotFound />

  // Selected variety solid; the other two ghosted for context.
  const bands = varieties.map((v) => ({ variety: v, ghost: v.slug !== variety.slug }))
  const others = varieties.filter((v) => v.slug !== variety.slug)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${variety.fullName} Dry Red Chilli`,
    category: 'Dry red chilli',
    description: variety.summary,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Scoville heat units', value: `${variety.shuLabel} SHU` },
      { '@type': 'PropertyValue', name: 'Moisture', value: variety.moisture },
      { '@type': 'PropertyValue', name: 'Foreign matter', value: variety.foreignMatter },
      { '@type': 'PropertyValue', name: 'HSN code', value: variety.hsn },
    ],
    brand: { '@type': 'Brand', name: company.name },
  }

  return (
    <>
      <Seo
        title={`${variety.fullName} Dry Red Chilli — Specification | MAVEH WORLD`}
        description={`${variety.fullName} dry red chilli: ${variety.shuLabel} SHU, ${variety.colour.toLowerCase()}, moisture ${variety.moisture}. ${variety.bestSuitedFor} HSN ${variety.hsn}.`}
        path={`/products/${variety.slug}`}
        jsonLd={productJsonLd}
      />

      {/* Breadcrumb */}
      <div className="border-b border-paper-line">
        <Container className="py-4">
          <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-label text-navy-400">
            <Link to="/products" className="hover:text-navy-700">Products</Link>
            <span aria-hidden className="mx-2">/</span>
            <span className="text-navy-700">{variety.name}</span>
          </nav>
        </Container>
      </div>

      <Section className="pt-10 sm:pt-14">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            {/* Main */}
            <div>
              <p className="label-mono">{variety.pungency} pungency</p>
              <h1 className="mt-3 text-4xl sm:text-5xl">{variety.fullName}</h1>
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-navy-500">
                {variety.summary}
              </p>

              {/* Best suited for */}
              <div className="mt-8 rounded-sm border border-paper-line bg-white p-6">
                <h2 className="label-mono text-navy-500">Best suited for</h2>
                <p className="mt-3 text-navy-900">{variety.bestSuitedFor}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {variety.applications.map((tag) => (
                    <li key={tag} className="rounded-sm bg-navy-700/5 px-3 py-1.5 font-mono text-xs text-navy-700">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specification */}
              <div className="mt-10">
                <h2 className="text-2xl">Specification</h2>
                <div className="mt-4">
                  <SpecTable variety={variety} />
                </div>
              </div>

              {/* Packing */}
              <div className="mt-10">
                <h2 className="text-2xl">Available packing</h2>
                <p className="mt-2 text-sm text-navy-500">
                  Minimum order quantity {company.moqLabel}, stated separately from bag sizes.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {variety.packing.map((p) => (
                    <li key={p} className="rounded-sm border border-paper-line px-3 py-1.5 font-mono text-xs text-navy-700">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Aside */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-sm border border-paper-line bg-white p-6 sm:p-8">
                <h2 className="font-mono text-xs uppercase tracking-label text-navy-500">
                  Where it sits
                </h2>
                <div className="mt-6">
                  <TheScale
                    bands={bands}
                    ariaLabel={`${variety.name} on the Scoville scale relative to the other varieties`}
                  />
                </div>
              </div>

              <Placeholder
                label={`${variety.name} — cleaned & sorted`}
                ratio="4 / 3"
                className="mt-5"
              />

              <div className="mt-5 rounded-sm border border-navy-700 bg-navy-700 p-6 text-paper">
                <p className="label-mono text-paper/60">Order this variety</p>
                <p className="mt-2 font-mono text-sm tabular-nums text-paper/90">
                  {variety.shuLabel} SHU · HSN {variety.hsn}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    to={`/enquiry?variety=${variety.slug}`}
                    size="lg"
                    className="bg-gold-500 text-navy-900 hover:bg-gold-500/90"
                  >
                    Request a quote
                  </Button>
                  <a
                    href={whatsappLink(`Hello MAVEH WORLD. I would like a quote for ${variety.fullName} dry red chilli.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-paper/40 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper/10"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    WhatsApp us
                  </a>
                </div>
              </div>
            </aside>
          </div>

          {/* Other varieties */}
          <div className="mt-16 border-t border-paper-line pt-10">
            <h2 className="label-mono text-navy-500">Other varieties</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {others.map((v) => (
                <Link
                  key={v.slug}
                  to={`/products/${v.slug}`}
                  className="group flex items-center justify-between rounded-sm border border-paper-line bg-white px-5 py-4 transition-colors hover:border-navy-400/60"
                >
                  <span>
                    <span className="font-display text-lg text-navy-900">{v.fullName}</span>
                    <span className="ml-3 font-mono text-xs tabular-nums text-navy-400">{v.shuLabel} SHU</span>
                  </span>
                  <span aria-hidden className="font-mono text-navy-700 transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand variety={variety.slug} varietyName={variety.fullName} />
    </>
  )
}
