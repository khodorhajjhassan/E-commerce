/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'didact-gothic': ['"Didact Gothic"', 'sans-serif'],
      },
    },
  },
  plugins: [
  ],
}