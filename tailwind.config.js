import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica', '"Helvetica Neue"', 'Arial', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
