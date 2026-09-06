/// <reference types="vite/client" />

// No custom environment variables are used. The quote form is handled by
// Netlify Forms, which needs no key — see the README.
//
// Anything added here is inlined by Vite at build time, so it must be set in
// the host's environment BEFORE the build runs, not configured afterwards.
interface ImportMetaEnv {
  readonly _placeholder?: never
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
