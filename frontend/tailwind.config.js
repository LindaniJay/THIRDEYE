/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1a202c',
        'cyan': '#0891b2',
        'white': '#ffffff',
        'dark-gray': '#374151',
        'bright-green': '#10b981',
        'bright-orange': '#f97316',
        'charcoal': '#2d3748',
        'bright-yellow': '#facc15',
      },
      blur: {
        xs: '2px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          'background': 'rgba(45, 55, 72, 0.3)', // charcoral with 30% opacity
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'border-radius': '0.5rem',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ],
};
