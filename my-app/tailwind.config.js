/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/preline/preline.js'
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f7fafc',
          dark: '#1a202c'
        },
        text: {
          light: '#1a202c',
          dark: '#e2e8f0'
        }
      }
    }
  },
  plugins: [
    require('preline/plugin'),
  ],
}
