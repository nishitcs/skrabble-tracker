/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tile: {
          light: '#FDF6E2',
          border: '#E5D3B3',
          shadow: '#C8B08A',
          dark: '#2A241D',
        },
      },
      boxShadow: {
        tile: '0 4px 0 0 #C8B08A, 0 6px 10px -2px rgba(0, 0, 0, 0.15)',
        'tile-active': '0 1px 0 0 #C8B08A, 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};