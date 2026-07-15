import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#B5C7D9',
        brand: {
          DEFAULT: '#402D1F',
          muted: '#635B56',
          accent: '#B77749',
        },
        surface: '#FFFDF7',
        badge: '#9EA8B4',
      },
      fontFamily: {
        // Fredoka first for EN chars, falls back to Prompt for TH chars
        heading: ['var(--font-en)', 'var(--font-th)', 'sans-serif'],
        // Prompt first for TH content; Fredoka fallback for EN chars
        body: ['var(--font-th)', 'var(--font-en)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
