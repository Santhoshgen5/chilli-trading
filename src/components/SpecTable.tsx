import type { Variety } from '../data/types'

interface Row {
  label: string
  value: string
  /** Render the value in mono/tabular (numbers, codes). */
  mono?: boolean
}

/**
 * Full specification table for a single variety. Placeholder fields (ASTA
 * colour, aflatoxin) are only rendered once the client supplies them — null
 * values are omitted, not shown as filler.
 */
export function SpecTable({ variety }: { variety: Variety }) {
  const rows: Row[] = [
    { label: 'Pungency', value: variety.pungency },
    { label: 'Scoville (SHU)', value: `${variety.shuLabel} SHU`, mono: true },
    { label: 'Colour', value: variety.colour },
    { label: 'Moisture', value: variety.moisture, mono: true },
    { label: 'Foreign matter', value: variety.foreignMatter, mono: true },
    { label: 'Form', value: variety.form },
    { label: 'HSN code', value: variety.hsn, mono: true },
  ]

  // Placeholders — appended only when supplied.
  if (variety.astaColour) rows.push({ label: 'ASTA colour', value: variety.astaColour, mono: true })
  if (variety.aflatoxin) rows.push({ label: 'Aflatoxin', value: variety.aflatoxin })
  if (variety.notes) rows.push({ label: 'Notes', value: variety.notes })

  return (
    <table className="w-full border-collapse text-left text-sm">
      <caption className="sr-only">{variety.fullName} specification</caption>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.label} className={i === 0 ? '' : 'border-t border-paper-line'}>
            <th
              scope="row"
              className="w-2/5 py-3 pr-4 align-top font-sans font-medium text-navy-400"
            >
              {row.label}
            </th>
            <td
              className={`py-3 align-top text-navy-900 ${
                row.mono ? 'font-mono tabular-nums' : ''
              }`}
            >
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
