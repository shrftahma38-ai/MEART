/** @type {import('tailwindcss').Config} */
// توکن‌های طراحی، دقیقاً مطابق نسخه اصلی سایت (client/tailwind.config.js) — با فونت فارسی.
export default {
  content: ['./amlok-iran/**/*.php', './amlok-iran/assets/js/*.js'],
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
        display: ['Vazirmatn', 'system-ui', 'sans-serif'],
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        label: ['0.75rem', { lineHeight: '1.6' }],
      },
      maxWidth: {
        shell: '1600px',
      },
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
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
};
