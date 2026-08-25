import { Button } from './Button'
import { Container } from './Section'
import { WhatsAppIcon } from './WhatsAppIcon'
import { Reveal } from './motion/Reveal'
import { whatsappLink } from '../lib/whatsapp'
import { routes } from '../lib/routes'
import type { VarietySlug } from '../data/types'

interface CtaBandProps {
  title?: string
  body?: string
  /** Prefills the quote form and the WhatsApp message with a variety. */
  variety?: VarietySlug
  varietyName?: string
}

export function CtaBand({
  title = 'Request a quote',
  body = 'Send your destination, quantity and preferred packing. We reply with pricing and the available specification.',
  variety,
  varietyName,
}: CtaBandProps) {
  const quoteHref = variety
    ? `${routes.contact.path}?variety=${variety}`
    : routes.contact.path
  const waMessage = varietyName
    ? `Hello MAVEH WORLD. I would like a quote for ${varietyName} dry red chilli.`
    : undefined

  return (
    <section className="surface-dark relative overflow-hidden bg-navy-band text-paper">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gold-rule" />
      <Container className="py-20 sm:py-24">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
          <Reveal className="max-w-xl">
            <h2 className="text-display-sm text-paper sm:text-display-md">{title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-200">{body}</p>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col gap-3 sm:flex-row">
            <Button href={quoteHref} size="lg" variant="on-dark">
              Request a quote
            </Button>
            <Button
              href={whatsappLink(waMessage)}
              external
              size="lg"
              variant="on-dark-outline"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
