/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure Tailwind scans your files for classes
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#10B981', // Using green-500 as the brand green color
      },
      backgroundImage: {
        'pricing-gradient': 'linear-gradient(to bottom, #FFF3C4, #FFFDF9)', // Custom gradient
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
        bricolage: ['var(--font-bricolage)'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};