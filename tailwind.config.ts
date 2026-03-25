import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lemonde: {
          blue: '#003f8a',
          'blue-dark': '#002d6b',
          'blue-light': '#1a5fa0',
          red: '#e30613',
          gray: '#4a4a4a',
          'gray-light': '#f5f5f5',
          'gray-border': '#d9d9d9',
          gold: '#c9a227',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#1a1a1a',
            lineHeight: '1.7',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
