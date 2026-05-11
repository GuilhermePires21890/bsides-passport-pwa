/** @type {import('tailwindcss').Config} */
import { activeTheme } from './theme.config.js';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: activeTheme.colors,
      },
      fontFamily: {
        mono: activeTheme.fonts.mono,
        sans: activeTheme.fonts.sans,
      },
      boxShadow: {
        'neon':    activeTheme.neonShadow,
        'neon-sm': activeTheme.neonShadowSm,
      },
      backgroundImage: {
        'grid-brand': `linear-gradient(var(--tw-color-brand-green, #00FF41) 1px, transparent 1px), linear-gradient(90deg, var(--tw-color-brand-green, #00FF41) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
