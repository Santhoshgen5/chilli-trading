interface PlaceholderProps {
  /** Describes the intended photo, e.g. "Colour sorting line". */
  label: string
  /** CSS aspect-ratio string, e.g. "4 / 3" (default), "16 / 9", "1 / 1". */
  ratio?: string
  className?: string
}

/**
 * Neutral placeholder block sized to the final image slot. Real photography of
 * product, warehouse, packing and loading drops into these later — no stock
 * spice imagery is used in the meantime.
 */
export function Placeholder({ label, ratio = '4 / 3', className = '' }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder for photograph: ${label}`}
      className={`relative flex items-center justify-center overflow-hidden rounded-sm border border-dashed border-navy-700/20 bg-navy-700/[0.04] ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {/* Corner registration ticks — instrument framing */}
      <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-navy-700/25" />
      <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-navy-700/25" />
      <span aria-hidden className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-navy-700/25" />
      <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-navy-700/25" />

      <div className="px-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-label text-navy-400/70">Photo</p>
        <p className="mt-1 font-mono text-xs text-navy-400">{label}</p>
      </div>
    </div>
  )
}
