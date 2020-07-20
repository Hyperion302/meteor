export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Swish',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap',
      },
      { rel: 'stylesheet', href: 'https://vjs.zencdn.net/7.8.2/video-js.css' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios-accesor.ts',
    '~/plugins/vue-instantsearch.js',
    '~/plugins/vue-autosuggest',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/auth',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Auth Configuration
   */
  auth: {
    strategies: {
      auth0: {
        domain: 'swish-auth.us.auth0.com',
        client_id: 'WwKd8ypZghFm8tS9ngzMYff9qFpjBJtg',
        audience: 'https://api.swish.tv',
      },
    },
    redirect: {
      login: '/',
      logout: '/',
      callback: '/callback',
      home: '/',
    },
  },
  /*
   ** Router Configuration
   */
  router: {
    middleware: ['auth'],
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    transpile: ['vue-instantsearch', 'instantsearch.js/es'],
  },
};
