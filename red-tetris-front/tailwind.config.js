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
        green: '#15BF26',
        blue: '#004EFF',
        yellow: '#FFF000',
        gray: '#1D1D1D',
        bluesky: '#00F5FF',
        red: '#FF0000',
        smallgray: '#DDDDDD',
        hardgray: '#0F0F0F'
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
