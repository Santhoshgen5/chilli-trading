import { company } from '../data/company'
import { Badge } from './Badge'

/**
 * Registrations, shown as badges.
 *
 * An item appears only when the registration is confirmed OR a number has been
 * supplied. Spices Board CRES and FSSAI are neither yet, so they render
 * nothing at all — no greyed-out slot, no "coming soon". The markup is ready
 * for them the moment the numbers land in `company.compliance`.
 */
export function ComplianceStrip({
  className = '',
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'dark'
}) {
  const items = company.compliance.filter((c) => c.confirmed || c.value)
  if (items.length === 0) return null

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {items.map((c) => (
        <li key={c.label}>
          <Badge tone={tone === 'dark' ? 'on-dark' : 'accent'} dot className="gap-2.5 py-2">
            <span className="font-display text-sm">{c.label}</span>
            {c.value && (
              <span className="font-mono text-[11px] tabular-nums opacity-70">{c.value}</span>
            )}
            <span className="sr-only">
              {c.name}
              {c.value ? `, ${c.value}` : ', registered'}
            </span>
          </Badge>
        </li>
      ))}
    </ul>
  )
}
