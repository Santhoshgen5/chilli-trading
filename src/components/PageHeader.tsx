import type { ReactNode } from 'react'
import { Container, Eyebrow } from './Section'
import { Reveal } from './motion/Reveal'
import { routes, type RouteKey } from '../lib/routes'

interface Crumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  eyebrow: string
  title: string
  intro?: ReactNode
  /** Trail above the heading. The last item is the current page. */
  breadcrumb?: Crumb[]
  /** Extra content below the intro — spec chips, a scale, actions. */
  children?: ReactNode
}

/**
 * Masthead for every page other than the home page.
 *
 * A navy band rather than paper, for two reasons: it gives the fixed header
 * something to sit on so the bar can stay transparent until scroll, exactly as
 * on the home page, and it keeps a single dark-to-light rhythm across the site.
 */
export function PageHeader({ eyebrow, title, intro, breadcrumb, children }: PageHeaderProps) {
  return (
    <section className="surface-dark relative overflow-hidden bg-navy-band">
      <Container>
        <div className="pb-16 pt-28 sm:pb-20 sm:pt-36">
          {breadcrumb && breadcrumb.length > 0 && (
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-label text-navy-300">
                  <li>
                    <a href={routes.home.path} className="transition-colors hover:text-paper">
                      Home
                    </a>
                  </li>
                  {breadcrumb.map((crumb, i) => (
                    <li key={crumb.label} className="flex items-center gap-2">
                      <span aria-hidden className="text-navy-400">
                        /
                      </span>
                      {crumb.href && i < breadcrumb.length - 1 ? (
                        <a href={crumb.href} className="transition-colors hover:text-paper">
                          {crumb.label}
                        </a>
                      ) : (
                        <span aria-current="page" className="text-paper">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>
          )}

          <Reveal index={0}>
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          </Reveal>

          <Reveal index={1}>
            <h1 className="mt-6 max-w-3xl text-display-sm text-paper sm:text-display-md lg:text-display-lg">
              {title}
            </h1>
          </Reveal>

          {intro && (
            <Reveal index={2}>
              <p className="mt-6 max-w-prose text-lg leading-relaxed text-navy-200">{intro}</p>
            </Reveal>
          )}

          {children && <Reveal index={3}>{children}</Reveal>}
        </div>
      </Container>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,rgba(201,162,39,0.8)_0%,rgba(201,162,39,0.15)_45%,rgba(201,162,39,0)_100%)]"
      />
    </section>
  )
}

/** Convenience: breadcrumb trail ending at the given route. */
export function crumbsFor(...keys: RouteKey[]): Crumb[] {
  return keys.map((key) => ({ label: routes[key].label, href: routes[key].path }))
}
