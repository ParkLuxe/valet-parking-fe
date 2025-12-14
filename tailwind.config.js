/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette for Park-Luxe
        background: {
          DEFAULT: '#0a0a0f',
          secondary: '#1a1a2e',
        },
        primary: {
          DEFAULT: '#667eea',
          light: '#8a9ef7',
          dark: '#5568d3',
        },
        accent: {
          DEFAULT: '#00d2ff',
          light: '#33deff',
          dark: '#00a5cc',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      },
      borderRadius: {
        'card': '16px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0 8px 32px rgba(0,0,0,0.3)',
        'glow-primary': '0 0 20px rgba(102, 126, 234, 0.5)',
        'glow-accent': '0 0 20px rgba(0, 210, 255, 0.5)',
      },
      backdropBlur: {
        'card': '10px',
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
