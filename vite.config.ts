import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA build for Netlify. No SSR.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
})
