/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#06030f',
        void: '#0b0618',
        electric: '#35e6ff',
        acid: '#c8ff3d',
        hotpink: '#ff2e97',
        tangerine: '#ff7a18',
        grape: '#8b5cf6',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['"Space Grotesk Variable"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(139,92,246,.35)',
        acid: '0 0 30px rgba(200,255,61,.3)',
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'marquee-reverse': 'marqueeReverse 34s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        float: 'float 6s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        flicker: 'flicker 4s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-18px) rotate(2deg)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: 1 },
          '20%, 22%, 24%, 55%': { opacity: 0.4 },
        },
      },
    },
  },
  plugins: [],
}
