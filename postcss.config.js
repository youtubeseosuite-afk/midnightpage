// Path: postcss.config.js
// Status: NY
// Formål: Uden denne fil bliver Tailwind-klasserne ikke processeret af Next.js' build.

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
