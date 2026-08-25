import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { Button } from './Button'
import { Container } from './Section'
import { primaryNav, routes, type RouteKey } from '../lib/routes'

interface HeaderProps {
  /** Which page we are on — drives the active nav state. */
  current?: RouteKey
  /**
   * True on pages whose first section is a dark hero. The bar starts
   * transparent and sitting on the hero, then resolves into frosted paper once
   * the reader scrolls past it.
   */
  overHero?: boolean
}

export function Header({ current, overHero = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        frame = 0
      })
    }
    onScroll() // a reload part-way down the page starts scrolled
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Close the mobile panel on Escape, and lock the header into its solid state
  // while it is open so the panel never floats over the hero unbacked.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || open || !overHero
  const tone = solid ? 'navy' : 'paper'

  return (
    // Fixed rather than sticky: a sticky bar occupies space in the flow, which
    // would push the hero down and leave the header sitting on the page ground
    // instead of over the artwork. `Shell` pads the top of <main> on pages that
    // do not open with a hero.
    <header
      className={[
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out',
        solid
          ? 'border-b border-paper-line bg-paper/80 shadow-header backdrop-blur-xl backdrop-saturate-150'
          : 'surface-dark border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          {/* The wordmark's alt text names this link, so no aria-label is
              needed — and none is wanted: an aria-label that did not contain
              the visible text would fail the accessible-name rule. */}
          <a href={routes.home.path} className="shrink-0 rounded-md">
            <Logo tone={tone} />
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((key) => {
              const route = routes[key]
              const active = current === key
              return (
                <a
                  key={key}
                  href={route.path}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'relative rounded-md px-3 py-2 text-sm transition-colors duration-200',
                    solid
                      ? active
                        ? 'text-navy-900'
                        : 'text-navy-500 hover:text-navy-900'
                      : active
                        ? 'text-paper'
                        : 'text-navy-200 hover:text-paper',
                  ].join(' ')}
                >
                  {route.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-px h-px bg-gold-500"
                    />
                  )}
                </a>
              )
            })}

            <span aria-hidden className="mx-2 h-5 w-px bg-current opacity-15" />

            <a
              href={routes.contact.path}
              className={[
                'rounded-md px-3 py-2 text-sm transition-colors duration-200',
                solid ? 'text-navy-500 hover:text-navy-900' : 'text-navy-200 hover:text-paper',
              ].join(' ')}
            >
              {routes.contact.label}
            </a>
            <Button
              href={routes.contact.path}
              size="md"
              variant={solid ? 'primary' : 'on-dark'}
              className="ml-1"
            >
              Request a quote
            </Button>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className={[
              'inline-flex items-center gap-2 rounded-md border px-3 py-2 transition-colors lg:hidden',
              solid
                ? 'border-paper-line-strong text-navy-600'
                : 'border-navy-300/30 text-navy-200',
            ].join(' ')}
          >
            <span className="font-mono text-xs uppercase tracking-label">
              {open ? 'Close' : 'Menu'}
            </span>
            <span aria-hidden className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform duration-200 ${open ? 'translate-y-[5px] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-[5px] h-0.5 w-4 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute left-0 top-[10px] h-0.5 w-4 bg-current transition-transform duration-200 ${open ? '-translate-y-[5px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile panel */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-paper-line bg-paper/95 backdrop-blur-xl lg:hidden"
        >
          <Container>
            <ul className="flex flex-col py-2">
              {[...primaryNav, 'contact' as const].map((key) => {
                const route = routes[key]
                const active = current === key
                return (
                  <li key={key}>
                    <a
                      href={route.path}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between border-b border-paper-line py-3.5 text-base ${
                        active ? 'text-navy-900' : 'text-navy-600'
                      }`}
                    >
                      {route.label}
                      {active && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />}
                    </a>
                  </li>
                )
              })}
              <li className="py-4">
                <Button href={routes.contact.path} size="lg" className="w-full">
                  Request a quote
                </Button>
              </li>
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
}
