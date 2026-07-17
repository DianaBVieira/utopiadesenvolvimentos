/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./memorial-eterno.html"],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        primary: "#ffffff",
        secondary: "#a1a1aa",
        accent: "#34d399",
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
