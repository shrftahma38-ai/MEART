/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#EEF2EF',
          100: '#D8E1DA',
          300: '#6E8378',
          500: '#2E4A3C',
          600: '#22403A',
          700: '#1A3A34',
          800: '#14302B',
          900: '#0E241F',
        },
        cream: {
          50: '#FDFCF9',
          100: '#F9F7F2',
          200: '#F3EEE3',
          300: '#E8E0D1',
        },
        gold: {
          100: '#F2E8D2',
          200: '#E7D8B6',
          300: '#D9C495',
          400: '#C8A96B',
          500: '#B8860B',
          600: '#A0760A',
          700: '#7E5C08',
        },
        ink: '#33362F',
        clay: '#C2703A',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'system-ui', 'sans-serif'],
        display: ['Lalezar', 'Vazirmatn', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -18px rgba(20, 48, 43, 0.35)',
        card: '0 14px 40px -28px rgba(26, 58, 52, 0.45)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
};
