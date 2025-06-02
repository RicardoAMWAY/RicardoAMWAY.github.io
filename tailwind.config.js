/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3490f3',
        secondary: '#0d141c',
        neutral: {
          100: '#f0f3f8',
          200: '#e7edf4',
          300: '#cedbe8',
          400: '#8494a5',
          500: '#49719c',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
} 