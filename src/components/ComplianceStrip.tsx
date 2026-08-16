import { company } from '../data/company'

/**
 * Registrations shown as status badges. Items are only rendered when the
 * registration is confirmed OR a number has been supplied — unconfirmed items
 * (Spices Board CRES, FSSAI) render nothing until the client provides them.
 */
export function ComplianceStrip({ className = '' }: { className?: string }) {
  const items = company.compliance.filter((c) => c.confirmed || c.value)
  if (items.length === 0) return null

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {items.map((c) => (
        <li
          key={c.label}
          className="flex items-center gap-2 rounded-sm border border-paper-line bg-white px-3 py-2"
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          <span className="font-display text-sm text-navy-900">{c.label}</span>
          <span className="font-mono text-[11px] uppercase tracking-label text-navy-400">
            {c.value ?? 'Registered'}
          </span>
          <span className="sr-only">
            {c.name}
            {c.value ? `, ${c.value}` : ', registered'}
          </span>
        </li>
      ))}
    </ul>
  )
}
