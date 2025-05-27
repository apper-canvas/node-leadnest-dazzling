/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**/*"
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A59',
          50: '#FFF4F1',
          100: '#FFE6DD',
          200: '#FFCBB6',
          300: '#FFAC8A',
          400: '#FF8B63',
          500: '#FF7A59',
          600: '#FF5722',
          700: '#E64100',
          800: '#BF360C',
          900: '#9E2A00'
        },
        secondary: {
          DEFAULT: '#0091AE',
          50: '#E6F7FA',
          100: '#B3E8F0',
          200: '#80D8E6',
          300: '#4DC8DC',
          400: '#26B8D2',
          500: '#0091AE',
          600: '#007A94',
          700: '#00627A',
          800: '#004B60',
          900: '#003346'
        },
        accent: {
          DEFAULT: '#FF8F73',
          light: '#FFB39C',
          dark: '#FF6B4A'
        },
        gray: {
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E8EAED',
          300: '#DADCE0',
          400: '#BDC1C6',
          500: '#9AA0A6',
          600: '#80868B',
          700: '#5F6368',
          800: '#3C4043',
          900: '#202124'
        },
        surface: {
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E8EAED',
          300: '#DADCE0',
          400: '#BDC1C6',
          500: '#9AA0A6',
          600: '#80868B',
          700: '#5F6368',
          800: '#3C4043',
          900: '#202124'
        }
      }

      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}