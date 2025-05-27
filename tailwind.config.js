/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hubspot: {
          orange: '#FF7A59',
          'orange-dark': '#E6694A',
          'orange-light': '#FF8F73',
          blue: '#0091AE',
          'blue-dark': '#007A94',
          'blue-light': '#1AA3C1',
          gray: {
            50: '#F5F8FA',
            100: '#EAEEF2',
            200: '#CBD6E2',
            300: '#99ACC2',
            400: '#7C98B6',
            500: '#516F90',
            600: '#425B76',
            700: '#33475B',
            800: '#2D3E50',
            900: '#182026'
          }
        }
      },
      fontFamily: {
        'sans': ['Lexend Deca', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'hubspot': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'hubspot-hover': '0 4px 16px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
};
