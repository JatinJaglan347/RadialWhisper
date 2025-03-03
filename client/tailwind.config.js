import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#272829',
        secondary: '#61677A',
        accent: '#D8D9DA',
        light: '#FFF6E0',
      },
    },
  },
  plugins: [daisyui],
}