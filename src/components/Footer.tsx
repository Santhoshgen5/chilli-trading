import { Link } from 'react-router-dom'
import { company } from '../data/company'
import { HSN_CODE } from '../data/varieties'
import { Logo } from './Logo'
import { Container } from './Section'
import { whatsappLink } from '../lib/whatsapp'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-8 bg-navy-900 text-paper/80">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo tone="paper" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Dry red chilli from Tamil Nadu, India — supplied to bulk buyers against a
              written specification.
            </p>
          </div>

          {/* Site links */}
          <nav aria-label="Footer" className="text-sm">
            <h2 className="label-mono text-paper/50">Site</h2>
            <ul className="mt-4 space-y-2">
              <li><Link to="/products" className="hover:text-paper">Products</Link></li>
              <li><Link to="/quality" className="hover:text-paper">Quality &amp; Process</Link></li>
              <li><Link to="/packaging" className="hover:text-paper">Packaging &amp; Shipping</Link></li>
              <li><Link to="/enquiry" className="hover:text-paper">Request a quote</Link></li>
              <li><Link to="/contact" className="hover:text-paper">Contact</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="text-sm">
            <h2 className="label-mono text-paper/50">Contact</h2>
            <ul className="mt-4 space-y-2">
              {company.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s+/g, '')}`} className="font-mono tabular-nums hover:text-paper">
                    {p}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`} className="hover:text-paper">{company.email}</a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                  WhatsApp
                </a>
              </li>
              {company.linkedin && (
                <li>
                  <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Address */}
          <address className="text-sm not-italic">
            <h2 className="label-mono text-paper/50">Registered address</h2>
            <p className="mt-4 leading-relaxed text-paper/70">
              {company.address.lines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
              <span className="block">
                {company.address.postalCode}, {company.address.country}
              </span>
            </p>
          </address>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} {company.name}. All rights reserved.</p>
          <p className="font-mono tabular-nums">HSN {HSN_CODE} · Thanjavur, Tamil Nadu, India</p>
        </div>
      </Container>
    </footer>
  )
}
