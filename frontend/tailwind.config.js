/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#E4E2DD',
        primary: '#1E1E1E',
        accent: {
          red: '#DB4A2B',
          orange: '#F8A348',
          pink: '#FF89A9',
        }
      },
      fontFamily: {
        heading: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      lineHeight: {
        'tighter': '0.75',
      },
      letterSpacing: {
        'tighter': '-0.05em',
      }
    },
  },
  plugins: [],
}
