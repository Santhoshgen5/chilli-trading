import { Container, Eyebrow } from './Section'
import { Button } from './Button'
import { HeroMedia } from './HeroMedia'
import { Reveal } from './motion/Reveal'
import { company } from '../data/company'
import { HSN_CODE } from '../data/varieties'
import { routes } from '../lib/routes'

// Specification figures shown under the hero. Deliberately not bag sizes — MOQ
// and packing formats never appear in the same list.
const SPECS = [
  { label: 'Minimum order', value: '1 MT' },
  { label: 'Moisture', value: '≤ 12%' },
  { label: 'HSN', value: HSN_CODE },
] as const

export function Hero() {
  return (
    <HeroMedia>
      <Container>
        <div className="relative pb-20 pt-28 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-44">
          <div className="max-w-2xl">
            <Reveal index={0}>
              <Eyebrow tone="dark">Dry red chilli exporter · Thanjavur, India</Eyebrow>
            </Reveal>

            <Reveal index={1}>
              <h1 className="mt-6 text-display-md text-paper sm:text-display-lg lg:text-display-xl">
                {company.tagline}
              </h1>
            </Reveal>

            <Reveal index={2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-200">
                Teja, Byadgi and Sannam S4 for bulk buyers. Cleaned, colour-sorted and
                checked against a written specification before packing.
              </p>
            </Reveal>

            <Reveal index={3}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href={routes.contact.path} size="lg" variant="on-dark">
                  Request a quote
                </Button>
                <Button href={routes.products.path} size="lg" variant="on-dark-outline">
                  View products
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal index={4}>
            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-paper/15 pt-6">
              {SPECS.map((spec) => (
                <div key={spec.label}>
                  {/* Reserve two lines on narrow screens: "Minimum order" wraps
                      while the others do not, and without this the values sit
                      on three different baselines. */}
                  <dt className="label-mono-dark min-h-[2.6em] sm:min-h-0">{spec.label}</dt>
                  <dd className="mt-2 font-mono text-base tabular-nums text-paper">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Scroll cue. Aligned to the content column on the left — the
              right-hand corner belongs to the WhatsApp button. Pure CSS, so the
              reduced-motion rule in index.css stills it without a second code
              path. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-0 hidden items-center gap-3 lg:flex"
          >
            <span className="font-mono text-[10px] uppercase tracking-label text-navy-300">
              Scroll
            </span>
            <span className="relative block h-10 w-px overflow-hidden bg-paper/20">
              <span className="absolute inset-x-0 top-0 h-4 animate-[scroll-cue_2.2s_ease-in-out_infinite] bg-gold-500" />
            </span>
          </div>
        </div>
      </Container>
    </HeroMedia>
  )
}
