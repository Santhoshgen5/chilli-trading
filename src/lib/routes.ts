// Single source of truth for the site's pages.
//
// Navigation is plain `<a href>` — there is no client-side router. Each entry
// here corresponds to one `.html` file in the project root, which Vite builds
// as its own document (see vite.config.ts).
//
// Hosts that serve `foo.html` at `/foo` (Netlify does) give clean URLs for
// free; the dev and preview servers are taught the same trick in vite.config.ts
// so all three environments behave identically.

export interface Route {
  /** URL path, extensionless. */
  path: string
  /** HTML entry filename, relative to the project root. */
  file: string
  /** Short label for navigation. */
  label: string
  /** Full label for breadcrumbs, footers and link titles. */
  title: string
}

export const routes = {
  home: { path: '/', file: 'index.html', label: 'Home', title: 'Home' },
  products: {
    path: '/products',
    file: 'products.html',
    label: 'Products',
    title: 'All varieties',
  },
  teja: { path: '/teja', file: 'teja.html', label: 'Teja', title: 'Teja (S17)' },
  byadgi: { path: '/byadgi', file: 'byadgi.html', label: 'Byadgi', title: 'Byadgi' },
  sannam: { path: '/sannam', file: 'sannam.html', label: 'Sannam', title: 'Sannam (S4)' },
  quality: {
    path: '/quality',
    file: 'quality.html',
    label: 'Quality',
    title: 'Quality & process',
  },
  packaging: {
    path: '/packaging',
    file: 'packaging.html',
    label: 'Packaging',
    title: 'Packaging & shipping',
  },
  about: { path: '/about', file: 'about.html', label: 'About', title: 'About MAVEH WORLD' },
  markets: {
    path: '/markets',
    file: 'markets.html',
    label: 'Markets',
    title: 'Export destinations',
  },
  contact: {
    path: '/contact',
    file: 'contact.html',
    label: 'Contact',
    title: 'Contact & request a quote',
  },
} as const satisfies Record<string, Route>

export type RouteKey = keyof typeof routes

/** Primary navigation, in order. */
export const primaryNav: RouteKey[] = [
  'products',
  'quality',
  'packaging',
  'markets',
  'about',
]

/** Variety detail pages, in the order they appear across the site. */
export const varietyRoutes = { teja: routes.teja, byadgi: routes.byadgi, sannam: routes.sannam }

/** Path for a variety's detail page. */
export function varietyPath(slug: 'teja' | 'byadgi' | 'sannam'): string {
  return routes[slug].path
}
