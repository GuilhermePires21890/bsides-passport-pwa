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
    },
  },
  plugins: [],
};
