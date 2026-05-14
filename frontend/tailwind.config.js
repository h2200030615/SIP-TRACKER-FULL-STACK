/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        'primary-dark': '#0052a3',
        'primary-light': '#e6f0ff',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        'gray-light': '#f9fafb',
      },
    },
  },
  plugins: [],
};
