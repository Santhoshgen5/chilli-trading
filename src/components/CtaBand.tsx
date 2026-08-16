import { Button } from './Button'
import { Container } from './Section'
import { WhatsAppIcon } from './WhatsAppIcon'
import { whatsappLink } from '../lib/whatsapp'
import type { VarietySlug } from '../data/types'

interface CtaBandProps {
  title?: string
  body?: string
  /** Prefill the enquiry form + WhatsApp message with a variety. */
  variety?: VarietySlug
  varietyName?: string
}

export function CtaBand({
  title = 'Request a quote',
  body = 'Send your destination, quantity and preferred packing. We reply with pricing and available specification.',
  variety,
  varietyName,
}: CtaBandProps) {
  const enquiryHref = variety ? `/enquiry?variety=${variety}` : '/enquiry'
  const waMessage = varietyName
    ? `Hello MAVEH WORLD. I would like a quote for ${varietyName} dry red chilli.`
    : undefined

  return (
    <section className="bg-navy-900 text-paper">
      <Container className="py-16 sm:py-20">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl text-paper sm:text-4xl">{title}</h2>
            <p className="mt-4 text-paper/70">{body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button to={enquiryHref} size="lg" className="bg-gold-500 text-navy-900 hover:bg-gold-500/90">
              Request a quote
            </Button>
            <a
              href={whatsappLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-none border border-paper/40 px-7 py-3.5 text-base font-medium text-paper transition-colors hover:bg-paper/10"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
