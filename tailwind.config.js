/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefaf3',
          100: '#d6f3e1',
          200: '#aee7c5',
          300: '#7dd5a3',
          400: '#4cbe80',
          500: '#27a55f',
          600: '#1a8549',
          700: '#156a3a',
          800: '#125430',
          900: '#0e4528',
        },
        ink: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b8b8c0',
          400: '#8d8d97',
          500: '#6b6b75',
          600: '#54545c',
          700: '#44444b',
          800: '#2d2d33',
          900: '#16161a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(0,0,0,0.08)',
        card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'grid-pattern':
          "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
