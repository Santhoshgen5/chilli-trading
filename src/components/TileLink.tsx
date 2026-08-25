/** Arrow link used at the foot of bento tiles and section headers. */
export function TileLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="group/link mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-navy-600 transition-colors hover:text-cyan-700"
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-300 ease-out group-hover/link:translate-x-1"
      >
        &rarr;
      </span>
    </a>
  )
}
