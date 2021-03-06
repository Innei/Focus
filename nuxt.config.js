const webpack = require('webpack')
module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || 'Focus',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Focus; RSS 2.0',
        href: process.env.BASE_URL + '/feed'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#2bd',
    height: '2px'
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },
  css: [
    {
      src: '~assets/scss/normalize.scss',
      lang: 'scss'
    }
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/element-ui.js' },
    { src: '~/plugins/plugin.js', mode: 'client' },
    {
      src: '~/plugins/axios',
      mode: 'client'
    },
    {
      src: '~plugins/router.js',
      mode: 'client'
    },
    { src: '~/plugins/preload.js' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/style-resources',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    prefix: '/api/',
    port: 3000
  },

  /*
   ** Build configuration
   */
  server: {
    host: '0.0.0.0'
  },
  styleResources: {
    scss: ['~assets/scss/colors/*', '~assets/scss/_variables.scss']
  },
  build: {
    // analyze: true,
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    babel: {
      presets({ isServer }) {
        const targets = isServer
          ? { node: 'current' }
          : { chrome: '72', safari: '12' }
        return [[require.resolve('@nuxt/babel-preset-app'), { targets }]]
      },
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ]
    },
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.plugins.push(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
      )
    }
  }
}
