import { company } from '../data/company'
import { HSN_CODE } from '../data/varieties'
import { LogoLockup } from './Logo'
import { Container } from './Section'
import { whatsappLink } from '../lib/whatsapp'
import { primaryNav, routes, varietyRoutes } from '../lib/routes'

const YEAR = new Date().getFullYear()

const linkClass =
  'text-navy-200 transition-colors duration-200 hover:text-paper'

export function Footer() {
  return (
    <footer className="surface-dark bg-navy-band text-navy-200">
      {/* Gold hairline seating the band against the page above. */}
      <div aria-hidden className="h-px bg-gold-rule" />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <LogoLockup height={96} className="h-20 w-auto" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-navy-300">
              Dry red chilli from Tamil Nadu, India — supplied to bulk buyers against a
              written specification.
            </p>
          </div>

          {/* Site */}
          <nav aria-label="Footer" className="text-sm">
            <h2 className="label-mono-dark">Site</h2>
            <ul className="mt-5 space-y-3">
              {primaryNav.map((key) => (
                <li key={key}>
                  <a href={routes[key].path} className={linkClass}>
                    {routes[key].label}
                  </a>
                </li>
              ))}
              <li>
                <a href={routes.contact.path} className={linkClass}>
                  {routes.contact.label}
                </a>
              </li>
            </ul>
          </nav>

          {/* Varieties */}
          <nav aria-label="Varieties" className="text-sm">
            <h2 className="label-mono-dark">Varieties</h2>
            <ul className="mt-5 space-y-3">
              {Object.values(varietyRoutes).map((route) => (
                <li key={route.path}>
                  <a href={route.path} className={linkClass}>
                    {route.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="text-sm">
            <h2 className="label-mono-dark">Contact</h2>
            <ul className="mt-5 space-y-3">
              {company.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className={`font-mono tabular-nums ${linkClass}`}
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`} className={linkClass}>
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  WhatsApp
                </a>
              </li>
              {/* Rendered only once the client supplies a URL. */}
              {company.linkedin && (
                <li>
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>

            <address className="mt-8 not-italic">
              <h2 className="label-mono-dark">Registered address</h2>
              <p className="mt-5 leading-relaxed text-navy-300">
                {company.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block">
                  {company.address.postalCode}, {company.address.country}
                </span>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/10 pt-8 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} {company.name}. All rights reserved.
          </p>
          <p className="font-mono tabular-nums">
            HSN {HSN_CODE} · Thanjavur, Tamil Nadu, India
          </p>
        </div>
      </Container>
    </footer>
  )
}
