import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
      fontFamily: {
        'sans': ['Arial', 'Hiragino Kaku Gothic ProN', 'Meiryo', 'sans-serif'],
        'en': ['Arial', 'sans-serif'],
        'ja': ['Hiragino Kaku Gothic ProN', 'Meiryo', 'MS PGothic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
