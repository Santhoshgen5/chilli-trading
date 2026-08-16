/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1236',
          700: '#0F1A4A',
          500: '#26356E',
          400: '#3B4A85',
        },
        gold: {
          500: '#C9A227',
          700: '#9A7B15',
        },
        cyan: {
          500: '#1CA9C9',
          700: '#137C93',
        },
        paper: {
          DEFAULT: '#F7F4EC',
          line: '#E4DFD2',
        },
      },
      fontFamily: {
        // Display: technical grotesque with spine. Body: institutional workhorse. Data: mono w/ tabular figures.
        display: ['"Space Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        label: '0.14em',
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        'scale-grow': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'scale-grow': 'scale-grow 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
