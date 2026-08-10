import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfaed',
          100: '#faf2ce',
          200: '#f5e399',
          300: '#efcd5a',
          400: '#e8b82a',
          500: '#d4961a',
          600: '#c9922a',
          700: '#a36d1a',
          800: '#86561c',
          900: '#72471c',
          950: '#42260c',
        },
        cream: {
          50: '#fdfaf5',
          100: '#fdf6e3',
          200: '#f9edca',
          300: '#f2dfa0',
          400: '#e9c96d',
          500: '#e0b345',
          600: '#d19a30',
          700: '#ae7b26',
          800: '#8d6124',
          900: '#734f20',
        },
        foody: {
          black: '#0A0A0A',
          gold: '#C9922A',
          'gold-light': '#D4AF37',
          cream: '#FDFAF5',
          green: '#2A5C1A',
          'green-light': '#3d7a27',
          brown: '#6B3A1F',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
