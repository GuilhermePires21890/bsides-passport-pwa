/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:  '#000000',
          green:  '#00FF41',
          green2: '#00CC33',
          red:    '#FF4500',
          yellow: '#FFD700',
          gray:   '#1A1A1A',
          gray2:  '#2A2A2A',
          muted:  '#888888',
        },
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px #00FF41, 0 0 20px #00FF4133',
        'neon-sm': '0 0 6px #00FF41, 0 0 12px #00FF4133',
      }
    },
  },
  plugins: [],
};