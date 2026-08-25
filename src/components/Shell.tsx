import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppFloat } from './WhatsAppFloat'
import type { RouteKey } from '../lib/routes'

interface ShellProps {
  children: ReactNode
  /** Current page — drives the active navigation state. */
  current?: RouteKey
  /** Set on pages that open with a dark hero, so the header starts transparent. */
  overHero?: boolean
}

/**
 * Page frame shared by every entry. One source of truth for the header, footer
 * and skip link across all ten documents.
 */
export function Shell({ children, current, overHero = false }: ShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header current={current} overHero={overHero} />
      {/* The header is fixed, so it contributes no height. Hero pages absorb
          that themselves through the hero's top padding; every other page needs
          the offset here. */}
      <main id="main" className={`flex-1 ${overHero ? '' : 'pt-16 sm:pt-[4.5rem]'}`}>
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
