/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        medical: {
          50:  '#f0f7ff',
          100: '#dbeeff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          900: '#1e3a5f',
        },
        danger: { 400: '#f87171', 600: '#dc2626' },
        safe:   { 400: '#4ade80', 600: '#16a34a' },
      },
    },
  },
  plugins: [],
};