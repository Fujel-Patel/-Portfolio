/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ── Color Palette ────────────────────────────── */
      colors: {
        // Cyans
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Purples
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Dark grays (for backgrounds & surfaces)
        dark: {
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#334155',
          300: '#1e293b',
          400: '#1a1a2e',
          500: '#16213e',
          600: '#111827',
          700: '#0f172a',
          800: '#0a0e1a',
          900: '#060810',
          950: '#030407',
        },
        // Accent
        accent: {
          DEFAULT: '#e94560',
          light: '#ff6b81',
          dark: '#c0392b',
        },
        // Neon glow helpers
        neon: {
          cyan: '#00fff5',
          purple: '#bf00ff',
          pink: '#ff00e4',
          blue: '#3b82f6',
        },
      },

      /* ── Typography ───────────────────────────────── */
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },

      /* ── Spacing / Sizing ─────────────────────────── */
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      /* ── Border Radius ────────────────────────────── */
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      /* ── Backdrop Blur ────────────────────────────── */
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },

      /* ── Box Shadow (glow effects) ────────────────── */
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35), 0 0 60px rgba(6, 182, 212, 0.15)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.35), 0 0 60px rgba(168, 85, 247, 0.15)',
        'glow-accent': '0 0 20px rgba(233, 69, 96, 0.35), 0 0 60px rgba(233, 69, 96, 0.15)',
        'glow-neon': '0 0 10px rgba(0, 255, 245, 0.4), 0 0 40px rgba(0, 255, 245, 0.15), 0 0 80px rgba(0, 255, 245, 0.05)',
        'inner-glow': 'inset 0 0 30px rgba(6, 182, 212, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
      },

      /* ── Keyframe Animations ──────────────────────── */
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(6, 182, 212, 0.2)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.7s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'slide-down': 'slide-down 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
      },

      /* ── Transitions ──────────────────────────────── */
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      /* ── Z-index ──────────────────────────────────── */
      zIndex: {
        'canvas': '0',
        'content': '10',
        'nav': '50',
        'modal': '100',
        'tooltip': '150',
      },

      /* ── Background Image (gradients) ─────────────── */
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 25%, #16213e 50%, #0f172a 75%, #060810 100%)',
      },
    },

    /* ── Responsive Breakpoints (customised) ────────── */
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
  },
  plugins: [],
}
