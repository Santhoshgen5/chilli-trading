import { StrictMode, type ReactElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

/**
 * Attach a page to its document.
 *
 * In a production build `scripts/prerender.mjs` has already written the page
 * into `#root`, so we hydrate it. The dev server serves the HTML entry as
 * authored, with `#root` empty, so there we render from scratch. Checking the
 * container rather than an env flag keeps the two paths honest.
 *
 * Marking the document hydrated cancels the failsafe in each page's head
 * script — see the comment there.
 */
export function mount(app: ReactElement): void {
  const container = document.getElementById('root')
  if (!container) throw new Error('mount: #root not found')

  const tree = <StrictMode>{app}</StrictMode>

  if (container.firstElementChild) {
    hydrateRoot(container, tree)
  } else {
    createRoot(container).render(tree)
  }

  document.documentElement.classList.add('hydrated')
}
