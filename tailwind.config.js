/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    require('daisyui'),
  ],
  theme: {
    extend: {
      colors: {
        grey: {
          100: '#FFFFFF',
          200: '#F0F0F0',
          300: '#A0A09F',
          400: '#605E5E',
          500: '#2F2E2E',
        },
        purple : {
          100: '#E4D9FF',
          200: '#AD8BF7',
          300: '#854DFF',
          400: '#5933AA',
          500: '#2C1A55',        
        },
        blue : {
          100: '#F2F7FF',
          200: '#9EC1F7',
          300: '#2E58FF',
          400: '#18339E',
          500: '#061551',        
        },
        lightblue : {
          100: '#EBFEFF',
          200: '#8EF5FA',
          300: '#0CDDE8',
          400: '#12AFB8',
          500: '#0E585C',        
        },
        green : {
          100: '#E8FFEE',
          200: '#9BFAB4',
          300: '#47FF78',
          400: '#37CC5F',
          500: '#227D3A',        
        },
        background: '#FFFFFF',
        foreground: "#2F2E2E",
        unitybg: '#FFFAEF',
      },
    },
  },
};
