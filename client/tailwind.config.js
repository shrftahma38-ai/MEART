/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A192F',
          50: '#F4F6FA',
          100: '#E4E9F2',
          200: '#C3CCDD',
          300: '#93A2BE',
          400: '#5C7093',
          500: '#33456B',
          600: '#1D3055',
          700: '#132444',
          800: '#0E1E38',
          900: '#0A192F',
          950: '#061223',
        },
        ivory: {
          DEFAULT: '#F8F5F2',
          light: '#FCFAF8',
          dark: '#EFE9E2',
        },
        champagne: {
          DEFAULT: '#C5A358',
          light: '#DCC48B',
          dark: '#9E7F3B',
        },
        slate: {
          DEFAULT: '#4A5568',
          soft: '#6B7484',
        },
        mist: '#EDF1F6',
      },
      fontFamily: {
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'label': ['0.75rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      letterSpacing: {
        label: '0.2em',
        wide2: '0.14em',
      },
      maxWidth: {
        shell: '1600px',
      },
      /**
       * The design uses fine, editorial opacities (0.15, 0.35, 0.65, 0.96 …) on
       * colours. Tailwind's default scale skips most of these steps, so the slash
       * modifiers would silently produce no class at all. Registering 0–100
       * removes that trap entirely.
       */
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, step) => [String(step), String(step / 100)]),
      ),
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-settle': {
          from: { transform: 'scale(1.03)' },
          to: { transform: 'scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'hero-settle': 'hero-settle 1.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'slide-down': 'slide-down 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
};
