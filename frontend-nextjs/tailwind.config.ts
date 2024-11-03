import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        floral_white: '#fffcf2',
        timberwolf: '#ccc5b9',
        black_olive: '#403d39',
        eerie_black: '#252422',
        flame: {
          DEFAULT: '#eb5e28',
          dark: '#c74e21', // For hover state
        },
      },
    },
  },
  plugins: [],
}
export default config
