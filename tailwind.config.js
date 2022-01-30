module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#ffff1a',
        secondary: 'rgba(255, 255, 26, 0.5)', // 50% opacity
        bgCodeBlock: 'hsl(230, 1%, 98%)',
      },
      screens: {
        /**
         * sometimes its nice to say: mobileOnly or padOnly: without needing to reset it with md:...
         */
        mobile: { max: '639px' },
        pad: { max: '767px' },
      },
    },
  },
  variants: {},
  plugins: [],
};
