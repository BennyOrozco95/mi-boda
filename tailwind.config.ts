/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        cursive: ['Great Vibes', 'cursive'],
      },
      colors: {
        beige: {
          50: '#FAF9F7',
          100: '#F5F3F0',
          200: '#EBE7E2',
          300: '#D8D0C7',
          400: '#C5B8AC',
          500: '#9C8B7A',
        },
      },
      letterSpacing: {
        'widest': '.25em',
        'super': '.5em',
      },
      height: {
        'screen-90': '90vh',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}