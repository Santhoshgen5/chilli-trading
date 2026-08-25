import type { Variety } from '../data/types'

interface Row {
  label: string
  value: string
  /** Render the value in mono/tabular — numbers, ranges, codes. */
  mono?: boolean
}

/**
 * Full specification for a single variety.
 *
 * ASTA colour and aflatoxin are appended only once the client supplies them.
 * A missing value is omitted entirely — never shown as a dash, "TBC" or an
 * invented figure. Every line on this table has to survive a buyer checking it.
 */
export function SpecTable({ variety, className = '' }: { variety: Variety; className?: string }) {
  const rows: Row[] = [
    { label: 'Pungency', value: variety.pungency },
    { label: 'Scoville (SHU)', value: `${variety.shuLabel} SHU`, mono: true },
    { label: 'Colour', value: variety.colour },
    { label: 'Moisture', value: variety.moisture, mono: true },
    { label: 'Foreign matter', value: variety.foreignMatter, mono: true },
    { label: 'Form', value: variety.form },
    { label: 'HSN code', value: variety.hsn, mono: true },
  ]

  if (variety.astaColour) rows.push({ label: 'ASTA colour', value: variety.astaColour, mono: true })
  if (variety.aflatoxin) rows.push({ label: 'Aflatoxin', value: variety.aflatoxin })
  if (variety.notes) rows.push({ label: 'Notes', value: variety.notes })

  return (
    <div className={`overflow-hidden rounded-card border border-paper-line bg-paper-50 shadow-card ${className}`}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{variety.fullName} specification</caption>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i === 0 ? '' : 'border-t border-paper-line'}>
              <th
                scope="row"
                className="w-2/5 px-5 py-4 align-top font-sans font-medium text-navy-500"
              >
                {row.label}
              </th>
              <td
                className={`px-5 py-4 align-top text-navy-900 ${row.mono ? 'font-mono tabular-nums' : ''}`}
              >
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
