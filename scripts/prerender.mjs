// Prerender — run after `vite build`.
//
// This is what makes the multi-page claim true. Vite gives each route its own
// HTML document, but those documents ship with an empty `#root`; a crawler
// that does not execute JS, or a reader with it switched off, would get
// nothing. So after the client build we render each page's React tree to a
// string and write it into its document.
//
// One source of truth is preserved: the same components produce the static
// HTML and then hydrate on top of it. There is no parallel copy of the markup.
//
// Two kinds of page are rendered:
//
//  · Static pages are discovered by convention — a key in `routes` maps to
//    `src/pages/<Key>.tsx`. Routes whose page file does not exist yet are
//    skipped with a note, so the build stays green while pages are landing.
//  · Variety pages have no component of their own. Each is `VarietyPage` bound
//    to one document from `content/varieties/`, which is why adding a product
//    needs no code — see scripts/gen-pages.mjs, which writes their documents.

import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')

const ROOT_DIV = '<div id="root"></div>'

const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * Inline the stylesheet into the document and drop the <link>.
 *
 * Lighthouse put ~2.4s of the mobile LCP in "render delay" with the image
 * already loaded: the page was waiting on one render-blocking stylesheet, a
 * whole extra round trip before anything could paint. The whole build is 7KB
 * gzipped, so it costs less to carry it in the document than to go and fetch it.
 *
 * The trade is that it is re-sent per page rather than cached across them. For
 * a ten-page marketing site, where most visits are one or two pages and first
 * paint is what gets judged, the round trip is worth more than the cache.
 */
async function inlineStylesheet(html) {
  const link = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
  if (!link) return { html, inlined: 0 }

  const css = await readFile(resolve(DIST, link[1].replace(/^\//, '')), 'utf8')
  return {
    html: html.replace(link[0], `<style>${css}</style>`),
    inlined: Buffer.byteLength(css),
  }
}

const server = await createServer({
  root: ROOT,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
})

let rendered = 0
let skipped = 0
const live = []

try {
  const { routes, varietyRoutes } = await server.ssrLoadModule('/src/lib/routes.ts')
  const { company } = await server.ssrLoadModule('/src/data/company.ts')
  const { varieties } = await server.ssrLoadModule('/src/data/varieties.ts')

  // The work list, built before anything is written so a missing static page
  // and a missing variety document are reported the same way.
  const jobs = []

  for (const [key, route] of Object.entries(routes)) {
    const pageFile = `src/pages/${capitalise(key)}.tsx`
    if (!existsSync(resolve(ROOT, pageFile))) {
      process.stdout.write(`  – ${route.file.padEnd(16)} no ${pageFile} yet, skipped\n`)
      skipped++
      continue
    }
    jobs.push({
      route,
      async element() {
        const mod = await server.ssrLoadModule(`/${pageFile}`)
        if (typeof mod.default !== 'function') {
          throw new Error(`${pageFile} must have a default-exported component`)
        }
        return createElement(mod.default)
      },
    })
  }

  if (varieties.length > 0) {
    const { VarietyPage } = await server.ssrLoadModule('/src/components/VarietyPage.tsx')
    for (const variety of varieties) {
      jobs.push({
        route: varietyRoutes[variety.slug],
        element: () => createElement(VarietyPage, { variety }),
      })
    }
  }

  for (const job of jobs) {
    const { route } = job
    const htmlFile = resolve(DIST, route.file)

    if (!existsSync(htmlFile)) {
      process.stdout.write(
        `  – ${route.file.padEnd(16)} not in dist — run \`npm run pages\` before the build\n`,
      )
      skipped++
      continue
    }

    const markup = renderToString(await job.element())
    const html = await readFile(htmlFile, 'utf8')

    if (!html.includes(ROOT_DIV)) {
      throw new Error(`${route.file} must contain exactly ${ROOT_DIV} for prerendering`)
    }

    const withMarkup = html.replace(ROOT_DIV, `<div id="root">${markup}</div>`)
    const { html: finalHtml } = await inlineStylesheet(withMarkup)
    await writeFile(htmlFile, finalHtml, 'utf8')

    const kb = (Buffer.byteLength(markup) / 1024).toFixed(1)
    process.stdout.write(`  ✓ ${route.file.padEnd(16)} ${kb.padStart(6)} KB of HTML\n`)
    live.push(route)
    rendered++
  }

  // Sitemap, built from the pages that actually rendered. Generating it here
  // rather than keeping a hand-written copy in public/ means it can never list
  // a URL that does not exist, or miss one that does — including the variety
  // pages, which nobody registers by hand.
  const origin = String(company.siteUrl).replace(/\/$/, '')
  // A page can exist without belonging in search results — the form's
  // confirmation page means nothing to anyone who has not just submitted it.
  const indexable = live.filter((route) => !route.noindex)
  const urls = indexable
    .map((route) => {
      const loc = `${origin}${route.path === '/' ? '/' : route.path}`
      const priority = route.path === '/' ? '1.0' : route.path === '/contact' ? '0.9' : '0.8'
      return `  <url><loc>${loc}</loc><changefreq>monthly</changefreq><priority>${priority}</priority></url>`
    })
    .join('\n')

  await writeFile(
    resolve(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<!-- Generated by scripts/prerender.mjs. Do not edit by hand. -->\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf8',
  )
  process.stdout.write(`  ✓ sitemap.xml     ${indexable.length} URL(s)\n`)
} finally {
  await server.close()
}

process.stdout.write(`Prerendered ${rendered} page(s)${skipped ? `, skipped ${skipped}` : ''}.\n`)
