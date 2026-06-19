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
        bg: '#F2EFE8',
        'bg-alt': '#EAE5DA',
        'bg-dark': '#15120D',
        text: '#15120D',
        'text-mid': '#4A4338',
        'text-muted': '#857A6A',
        'text-dim': '#9A9081',
        'text-inv': '#F2EFE8',
        border: '#E0D9CB',
        'border-dark': '#2C271F',
        accent: '#E10600',
        f1: '#E10600',
        wec: '#0E8C5A',
        wrc: '#E8842B',
        superrace: '#2C5BD6',
        nfestival: '#00A5C4',
      },
      fontFamily: {
        archivo: ['Archivo', 'sans-serif'],
        noto: ['Noto Sans KR', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'card-hover': '0 18px 40px rgba(21,18,13,0.10)',
        subtle: '0 1px 3px rgba(0,0,0,0.08)',
      },
      transitionProperty: {
        'transform-shadow': 'transform, box-shadow',
      },
    },
  },
  plugins: [],
}

export default config
