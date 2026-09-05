/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        guardian: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        risk: {
          safe: {
            DEFAULT: '#10b981',
            light: '#d1fae5',
            dark: '#065f46',
            bg: 'rgba(16, 185, 129, 0.1)',
            border: 'rgba(16, 185, 129, 0.25)',
          },
          review: {
            DEFAULT: '#f59e0b',
            light: '#fef3c7',
            dark: '#92400e',
            bg: 'rgba(245, 158, 11, 0.1)',
            border: 'rgba(245, 158, 11, 0.25)',
          },
          high: {
            DEFAULT: '#f43f5e',
            light: '#ffe4e6',
            dark: '#9f1239',
            bg: 'rgba(244, 63, 94, 0.1)',
            border: 'rgba(244, 63, 94, 0.25)',
          },
          neutral: {
            DEFAULT: '#0ea5e9',
            light: '#e0f2fe',
            dark: '#075985',
            bg: 'rgba(14, 165, 233, 0.1)',
            border: 'rgba(14, 165, 233, 0.25)',
          }
        },
        surface: {
          base: '#090d16',
          card: '#0f172a',
          cardHover: '#131e36',
          border: '#1e293b',
          borderLight: '#334155',
          accent: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-safe': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-review': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'glow-high': '0 0 20px -5px rgba(244, 63, 94, 0.3)',
        'glow-shield': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 2s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
