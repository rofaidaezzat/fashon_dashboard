/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#704e2c',
          hover: '#714f2c',
          50: '#fcf9f6',
          100: '#f6f0e9',
          200: '#eaddd0',
          300: '#dbc4b0',
          400: '#caae8c',
          500: '#b8946b',
          600: '#704e2c', // Main color
          700: '#714f2c', // Secondary/Hover
          800: '#4d3620',
          900: '#2d2013',
        }
      }
    },
  },
  plugins: [],
}
