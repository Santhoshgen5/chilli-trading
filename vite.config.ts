import { defineConfig, type Plugin, type PreviewServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

// Multi-page build: every .html file in the project root is its own entry, so
// each route ships a real HTML document that loads and indexes independently.
// Adding a page means adding a file — there is nothing to register here.
const input = Object.fromEntries(
  readdirSync(root)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.slice(0, -'.html'.length), resolve(root, f)]),
)

/**
 * Refuse form posts locally, loudly.
 *
 * Netlify handles form submissions at its edge; neither the dev server nor
 * `vite preview` has any such handler. Left alone, a POST to the form's action
 * just returns that page with a 200 — which the submit handler reads as
 * success, so the site cheerfully says "Thank you" having sent nothing. That is
 * worse than failing outright, because it hides the failure.
 *
 * 501 is the honest answer: the endpoint exists in production, not here. The
 * page then shows its error state with the WhatsApp and email fallback, which
 * is exactly what a real failure looks like.
 */
function noLocalFormHandler(): Plugin {
  const attach = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((req, res, next) => {
      if (req.method !== 'POST') return next()
      res.statusCode = 501
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end(
        'Form submissions are handled by Netlify and are not available locally.\n' +
          'Deploy, or test against the deployed site.\n',
      )
    })
  }

  return {
    name: 'no-local-form-handler',
    configureServer: (server) => attach(server),
    configurePreviewServer: (server) => attach(server),
  }
}

/**
 * Serve `/products` from `products.html`.
 *
 * Netlify does this for us in production. Without it locally, dev and preview
 * would 404 on every link in the site, which is a good way to ship a broken
 * href without noticing.
 */
function cleanUrls(): Plugin {
  const attach = (server: ViteDevServer | PreviewServer, base: string) => {
    server.middlewares.use((req, _res, next) => {
      const url = req.url ?? '/'
      const [path, query = ''] = url.split('?')
      if (path === '/' || path.includes('.')) return next()

      const candidate = `${path.replace(/\/$/, '')}.html`
      if (existsSync(resolve(base, candidate.slice(1)))) {
        req.url = query ? `${candidate}?${query}` : candidate
      }
      next()
    })
  }

  return {
    name: 'clean-urls',
    configureServer: (server) => attach(server, root),
    configurePreviewServer: (server) => attach(server, resolve(root, 'dist')),
  }
}

export default defineConfig({
  plugins: [react(), cleanUrls(), noLocalFormHandler()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      input,
      output: {
        // Keep React and the motion runtime in stable, separately-cached chunks
        // so a copy edit does not invalidate the whole bundle.
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
