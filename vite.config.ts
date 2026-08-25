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
  plugins: [react(), cleanUrls()],
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
