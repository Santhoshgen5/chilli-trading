import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { Button } from './Button'
import { Container } from './Section'

const NAV = [
  { to: '/products', label: 'Products' },
  { to: '/quality', label: 'Quality & Process' },
  { to: '/packaging', label: 'Packaging & Shipping' },
  { to: '/contact', label: 'Contact' },
]

function navClass({ isActive }: { isActive: boolean }): string {
  return [
    'text-sm text-navy-500 transition-colors hover:text-navy-900',
    isActive ? 'text-navy-900 underline underline-offset-8 decoration-gold-500 decoration-2' : '',
  ].join(' ')
}

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-paper-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="MAVEH WORLD — home" className="shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
            <Button to="/enquiry" size="md">
              Request a quote
            </Button>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-sm border border-paper-line px-3 py-2 lg:hidden"
          >
            <span className="font-mono text-xs uppercase tracking-label text-navy-500">
              {open ? 'Close' : 'Menu'}
            </span>
            <span aria-hidden className="relative block h-3 w-4">
              <span className={`absolute left-0 top-0 h-0.5 w-4 bg-navy-700 transition ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[5px] h-0.5 w-4 bg-navy-700 transition ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-[10px] h-0.5 w-4 bg-navy-700 transition ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile nav panel */}
      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-paper-line bg-paper lg:hidden">
          <Container>
            <ul className="flex flex-col py-2">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `block border-b border-paper-line py-3 text-navy-700 ${isActive ? 'text-navy-900' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-4">
                <Button to="/enquiry" className="w-full">
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
