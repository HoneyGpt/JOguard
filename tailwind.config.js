/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Claude-inspired Terracotta / Warm Orange palette
        terracotta: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c', // Primary Accent
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Warm Neutral Background & Surface Palette
        warm: {
          50: '#faf9f6',  // Light Mode Main BG
          100: '#f5f3ef', // Light Mode Card Secondary
          200: '#e6e2da', // Light Mode Border
          300: '#d3ccbe',
          400: '#a89f91',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524', // Dark Mode Card BG
          900: '#1c1917', // Dark Mode Main BG
          950: '#0c0a09',
        },
      },
      borderRadius: {
        '20': '20px',
        '24': '24px',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(44, 39, 36, 0.05)',
        'warm-md': '0 6px 20px -4px rgba(44, 39, 36, 0.08)',
        'warm-lg': '0 12px 32px -6px rgba(44, 39, 36, 0.12)',
        'terracotta-glow': '0 4px 20px -2px rgba(234, 88, 12, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
