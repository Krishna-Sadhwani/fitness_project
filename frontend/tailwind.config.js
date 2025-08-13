/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
],
  theme: {
    extend: {
      colors: {
        brand: '#16C47F',
        brandDark: '#12a56c',
        brandLight: '#E9F8F1',
      },
    },
  },
  plugins: [],
}

