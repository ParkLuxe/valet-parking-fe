/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        // Obsidian + Violet design system
        background: {
          DEFAULT: '#09090f',
          secondary: '#111117',
        },
        surface: {
          DEFAULT: '#09090f',
          low: '#111117',
          mid: '#1a1a24',
          high: '#222230',
          highest: '#2a2a3a',
          bright: '#32324a',
        },
        primary: {
          DEFAULT: '#8b5cf6',
          light: '#c4b5fd',
          dark: '#6d28d9',
          on: '#ffffff',
        },
        secondary: {
          DEFAULT: '#e879f9',
          light: '#f5d0fe',
          dark: '#a21caf',
          on: '#ffffff',
        },
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
        'error-container': '#7f1d1d',
        'on-surface': '#f4f4f5',
        'on-surface-variant': '#a1a1aa',
        outline: '#52525b',
        'outline-variant': '#3f3f46',
      },
      backgroundImage: {},
      borderRadius: {
        'card': '12px',
        'button': '0.375rem',
      },
      boxShadow: {
        'card': '0 24px 60px rgba(4,0,14,0.55)',
        'glow-primary': '0 0 30px rgba(124,255,225,0.28)',
        'glow-accent': '0 0 30px rgba(165,139,255,0.25)',
        'glow-gold': '0 0 30px rgba(255,122,217,0.22)',
        'ambient': '0 10px 36px rgba(4,0,14,0.45)',
      },
      backdropBlur: {
        'card': '12px',
        'glass': '12px',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'count-up 1s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
