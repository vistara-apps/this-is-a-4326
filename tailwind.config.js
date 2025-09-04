/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 10% 98%)',
        accent: 'hsl(280 70% 50%)',
        border: 'hsl(220 15% 90%)',
        primary: 'hsl(210 70% 50%)',
        surface: 'hsl(0 0% 100%)',
        textPrimary: 'hsl(220 15% 20%)',
        textSecondary: 'hsl(220 15% 40%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '20px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 hsla(0,0%,0%,0.05)',
        'md': '0 4px 6px -1px hsla(0,0%,0%,0.1), 0 2px 4px -2px hsla(0,0%,0%,0.1)',
        'lg': '0 8px 24px hsla(0,0%,0%,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}