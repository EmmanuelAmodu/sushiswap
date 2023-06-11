// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: 'class',
  presets: [require('@sushiswap/ui/tailwind.js')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './common/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@sushiswap/ui/!(node_modules)/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@sushiswap/wagmi/!(node_modules)/**/*.{js,ts,jsx,tsx,mdx}',
    // './node_modules/@sushiswap/wagmi/!(node_modules)/**/*.{ts,tsx,mdx}',
    // './node_modules/@sushiswap/ui/!(node_modules)/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      display: ['group-hover'],
      visibility: ['group-hover'],
      keyframes: {
        dash: {
          to: {
            'stroke-dashoffset': '0',
          },
        },
      },
    },
  },
}

module.exports = tailwindConfig
