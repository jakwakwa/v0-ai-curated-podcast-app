/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-mixins': {
      mixinsDir: './styles/02-tools'
    },
    tailwindcss: {},
  },
};

export default config;
