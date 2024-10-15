import type { Config } from 'tailwindcss'
import Colors from 'tailwindcss/colors'
// const colors = require('tailwindcss/colors')
require('./assets/css/cssAsPlugin')

export default <Partial<Config>>{
  content: ['docs/content/**/*.md'],
  darkMode: ['class', '[data-mode="darks"]'],
  corePlugins: {
    aspectRatio: false
  },
  colorMode: {
    preference: 'light'
  },
  theme: {
    screens: {
      sm: '480px',
      md: '600px',
      lg: '800px',
      xl: '1200px'
    },
    fontSize: {
      xxs: '0.5rem',
      xs: '0.625rem',
      sm: '0.75rem',
      tiny: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      '20xl': '1.25rem',
      '24xl': '1.5rem',
      '28xl': '1.75rem',
      '32xl': '2rem',
      '36xl': '2.25rem',
      '40xl': '2.5rem'
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px'
    },
    borderRadius: {
      none: '0px',
      sm: '2px',
      DEFAULT: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '24px',
      '3.5xl': '28px',
      '4xl': '30px',
      full: '9999px'
    },
    letterSpacing: {
      base: '-.6px'
    },
    extend: {
      colors: {
        rgray: {
          50: '#F2F2F2',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#454545',
          900: '#3D3D3D',
          950: '#272727'
        },
        orange: {
          50: '#FFF5ED',
          100: '#FFE9D3',
          200: '#FFCEA8',
          300: '#FFAB70',
          400: '#FF7C37',
          500: '#FF5207',
          600: '#F03F07',
          700: '#C72B08',
          800: '#9E230E',
          900: '#7F200F',
          950: '#450C05'
        },
        'caribbean-green': {
          50: '#EAFFF6',
          100: '#CDFEE7',
          200: '#9FFAD5',
          300: '#64F2BF',
          400: '#24E2A5',
          500: '#00D094',
          600: '#01A475',
          700: '#028362',
          800: '#01674D',
          900: '#005542',
          950: '#003026'
        },
        white: '#ffffff',
        black: '#121212',
        transparent: 'transparent',
        kakao: '#f9e000'
      },
      width: {
        '22': '88px',
        pc: '375px'
      },
      height: {
        '12.5': '50px',
        '13': '3.25rem',
        '18': '72px',
        '22': '88px'
      },
      spacing: {
        '15': '60px'
      },
      maxWidth: {
        pc: '375px'
      },
      lineHeight: {
        label: '8px',
        '16': '16px',
        '18': '18px',
        '20': '20px',
        '22': '22px',
        '24': '24px',
        '28': '28px',
        '30': '30px',
        '32': '32px',
        '38': '38px',
        '42': '42px',
        '46': '46px',
        '52': '52px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('./assets/css/utilities/button.css'),
    require('./assets/css/utilities/badge.css'),
    require('./assets/css/utilities/text.css'),
    require('./assets/css/utilities/utilities.css')
  ]
}
