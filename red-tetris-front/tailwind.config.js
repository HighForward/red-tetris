module.exports = {
  purge: [
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
        black: '#000000',
        pink: '#FD76CB',
        orange: '#FFAC30',
        purple: '#7E00AD',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
