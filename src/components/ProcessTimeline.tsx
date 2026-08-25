import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { company } from '../data/company'
import { processIcons } from './ProcessIcons'
import { STAGGER, useMotionPrefs, VIEWPORT } from '../lib/motion'

/**
 * The seven steps every lot goes through, in order.
 *
 * Horizontal on wide screens with a connecting rule that draws itself left to
 * right as the steps arrive; vertical on narrow ones, where a seven-column row
 * would be unreadable. The row scrolls inside its own container between those
 * two points — the page itself never scrolls sideways.
 *
 * As everywhere else, the drawn state lives in CSS under `html.js-reveal`, so
 * without JS the rule is simply already there and all seven steps are visible.
 */
export function ProcessTimeline({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, VIEWPORT)
  const { reduced } = useMotionPrefs()

  const delayFor = (i: number) => (reduced ? 0 : i * STAGGER * 1.5)

  return (
    <div ref={ref} className={className}>
      {/* Narrow: vertical */}
      <ol className="relative space-y-8 lg:hidden">
        <span
          aria-hidden
          data-grow-y=""
          data-shown={inView ? '' : undefined}
          className="absolute bottom-4 left-6 top-4 w-px origin-top bg-navy-200"
        />
        {company.process.map((step, i) => {
          const Icon = processIcons[step.title]
          return (
            <li key={step.title} className="relative flex gap-5">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-paper-line bg-paper-50 text-navy-700 shadow-card">
                {Icon ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <span className="font-mono text-xs tabular-nums">{i + 1}</span>
                )}
              </span>
              <div className="pt-1.5">
                <p className="font-mono text-xs tabular-nums text-navy-500">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-1 font-display text-lg text-navy-900">{step.title}</h3>
                <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-navy-500">
                  {step.detail}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      {/* Wide: horizontal */}
      <div className="hidden overflow-x-auto pb-2 lg:block">
        <ol className="relative flex min-w-[64rem] gap-4">
          <span
            aria-hidden
            data-grow-x=""
            data-shown={inView ? '' : undefined}
            className="absolute left-6 right-6 top-6 h-px origin-left bg-navy-200"
          />
          {company.process.map((step, i) => {
            const Icon = processIcons[step.title]
            return (
              <li key={step.title} className="relative flex-1">
                <span
                  data-reveal=""
                  data-shown={inView ? '' : undefined}
                  style={
                    { '--reveal-delay': `${Math.round(delayFor(i) * 1000)}ms` } as React.CSSProperties
                  }
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-paper-line bg-paper-50 text-navy-700 shadow-card"
                >
                  {Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <span className="font-mono text-xs tabular-nums">{i + 1}</span>
                  )}
                </span>
                <div
                  data-reveal=""
                  data-shown={inView ? '' : undefined}
                  style={
                    {
                      '--reveal-delay': `${Math.round((delayFor(i) + 0.08) * 1000)}ms`,
                    } as React.CSSProperties
                  }
                  className="mt-5 pr-4"
                >
                  <p className="font-mono text-xs tabular-nums text-navy-500">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1.5 font-display text-base leading-snug text-navy-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">{step.detail}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
