/* eslint-disable node/no-unpublished-require */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{jsx,tsx,js,ts,css}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
  safelist: ['prose'],
};
