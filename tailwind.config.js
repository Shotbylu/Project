import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        12: 'var(--fs-12)',
        14: 'var(--fs-14)',
        16: 'var(--fs-16)',
        20: 'var(--fs-20)',
        24: 'var(--fs-24)',
        32: 'var(--fs-32)',
        48: 'var(--fs-48)',
      },
    },
  },
  plugins: [],
};
