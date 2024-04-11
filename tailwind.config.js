/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        dmsans: ['DM Sans', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif']
      },
    },
  },
  plugins: [],
}

