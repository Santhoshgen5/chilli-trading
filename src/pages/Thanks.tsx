import { Shell } from '../components/Shell'
import { PageHeader } from '../components/PageHeader'
import { Container, Section } from '../components/Section'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { Reveal } from '../components/motion/Reveal'
import { whatsappLink } from '../lib/whatsapp'
import { company } from '../data/company'
import { routes } from '../lib/routes'

/**
 * Where the quote form lands after a successful submission.
 *
 * This exists for the reader without JavaScript. Netlify redirects a native
 * form post to the form's `action`, and landing back on an apparently untouched
 * form is indistinguishable from the submission having failed. With JS the
 * confirmation is rendered in place on the contact page instead and this page
 * is never seen.
 *
 * It makes no promise about response times — there is no service level to
 * quote — and it repeats the direct routes, because someone who has just sent
 * an enquiry is exactly the person who might want to chase it.
 */
export default function ThanksPage() {
  return (
    <Shell current="contact" overHero>
      <PageHeader
        eyebrow="Enquiry received"
        title="Thank you — we have your enquiry."
        intro="We will reply with pricing and the available specification for the varieties and quantity you asked about."
        breadcrumb={[{ label: 'Contact', href: routes.contact.path }, { label: 'Thank you' }]}
      />

      <Section>
        <Container>
          <Reveal>
            <Card className="max-w-2xl p-8 sm:p-10">
              <h2 className="text-2xl text-navy-900">If it is urgent</h2>
              <p className="mt-4 leading-relaxed text-navy-500">
                Message us on WhatsApp and quote your company name — it is usually the
                fastest way to reach us. You can also reply directly to{' '}
                <a
                  href={`mailto:${company.email}`}
                  className="text-cyan-700 underline underline-offset-4"
                >
                  {company.email}
                </a>
                .
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={whatsappLink(
                    'Hello MAVEH WORLD. I have just sent an enquiry through your website.',
                  )}
                  external
                  size="lg"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp us
                </Button>
                <Button href={routes.products.path} size="lg" variant="secondary">
                  Back to products
                </Button>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>
    </Shell>
  )
}
