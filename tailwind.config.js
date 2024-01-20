/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fade: 'fadeIn 2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: {
            top: '-20px',
            opacity: '0',

          },
          to: {
            opacity: '1',
            top: '0px',
          },
        },
      },
    },
  },
  plugins: [],
};
