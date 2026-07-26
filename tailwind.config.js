/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./memorial-eterno.html", "./dentalflow.html", "./pulso-utopia.html", "./pulso-utopia-privacidade.html", "./pulso-utopia-exclusao-dados.html", "./finance.html", "./sites-academias.html", "./identidades-visuais.html", "./portfolio.html"],
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
