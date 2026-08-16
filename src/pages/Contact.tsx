import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { Container, Section } from '../components/Section'
import { Placeholder } from '../components/Placeholder'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { whatsappLink } from '../lib/whatsapp'
import { company } from '../data/company'

const waMessage = 'Hello MAVEH WORLD. I found you online and would like to discuss a dry red chilli order.'

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact — MAVEH WORLD Dry Red Chilli Exporter, Thanjavur"
        description="Contact MAVEH WORLD in Thanjavur, Tamil Nadu. Phone, email and WhatsApp. Export enquiries for Teja, Byadgi and Sannam S4 dry red chilli."
        path="/contact"
      />

      <PageHeader
        eyebrow="Contact"
        title="Talk to us"
        intro="Export enquiries, specifications and samples. WhatsApp is usually the fastest way to reach us."
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Details */}
            <div className="space-y-8">
              <div>
                <h2 className="label-mono text-navy-500">Phone</h2>
                <ul className="mt-3 space-y-1">
                  {company.phones.map((p) => (
                    <li key={p}>
                      <a href={`tel:${p.replace(/\s+/g, '')}`} className="font-mono text-lg tabular-nums text-navy-900 hover:text-cyan-700">
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="label-mono text-navy-500">Email</h2>
                <p className="mt-3">
                  <a href={`mailto:${company.email}`} className="text-lg text-navy-900 underline underline-offset-4 hover:text-cyan-700">
                    {company.email}
                  </a>
                </p>
              </div>

              <div>
                <h2 className="label-mono text-navy-500">WhatsApp</h2>
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-sm bg-navy-700 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-navy-900"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </div>

              {company.linkedin && (
                <div>
                  <h2 className="label-mono text-navy-500">LinkedIn</h2>
                  <p className="mt-3">
                    <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="text-navy-900 underline underline-offset-4 hover:text-cyan-700">
                      Company page
                    </a>
                  </p>
                </div>
              )}

              <div>
                <h2 className="label-mono text-navy-500">Address</h2>
                <address className="mt-3 not-italic leading-relaxed text-navy-900">
                  {company.address.lines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                  <span className="block">{company.address.postalCode}, {company.address.country}</span>
                </address>
              </div>
            </div>

            {/* Location placeholder */}
            <div>
              <Placeholder label="Location — Orathanadu, Thanjavur" ratio="4 / 3" />
              <p className="mt-3 font-mono text-xs text-navy-400">
                Orathanadu (Taluk &amp; Post), Thanjavur District, Tamil Nadu, India.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
