/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af',
          light: '#3b82f6',
        },
        secondary: '#1e293b',
        accent: '#0ea5e9',
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
      },
      height: {
        screen: '100vh',
        'screen-dvh': '100dvh',
      },
      minHeight: {
        'screen-dvh': '100dvh',
      },
    },
  },
  plugins: [],
};