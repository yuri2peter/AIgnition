// eslint-disable-next-line node/no-unpublished-require
const defaultTheme = require('tailwindcss/defaultTheme');

/* eslint-disable node/no-unpublished-require */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{jsx,tsx,js,ts,css}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
  safelist: ['prose'],
  important: false,
};
