let development = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    script: [
      { src: 'https://hb.vntsm.com/v3/live/ad-manager.min.js', type: 'text/javascript','data-site-id':"5ed7746cb519801b8a4d515b",'data-mode':"scan", 'async':'true', 'data-cfasync':'false'},
      {
        src: "https://code.jquery.com/jquery-3.3.1.slim.min.js",
        type: "text/javascript"
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: ''},
      {hid: 'keywords', name: 'keywords', content: ''}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.co' },
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap'},
      {rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.2.0/css/all.css'},
      {rel: 'stylesheet', href: 'https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css'},
    ],
  },
  env: {
    baseUrl: development ? 'http://localhost:3030/' : process.env.BASE_URL
  },
  axios: {
    baseURL: '/'
  },
  generate: {
    minify: false
  },
  server: {
    port: process.env.PORT||3030, // default: 3000
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/css/main.scss',
    '~/css/jquery.bracket.min.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/myplugin.js', mode: 'client' },
    { src: '~plugins/ga.js', mode: 'client' },
    { src: "@/plugins/chart", ssr: false },
    { src: "@/plugins/jquery-bracket", ssr: false },
    { src: "@/plugins/jsoncsv", ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    'nuxt-device-detect',
    '@nuxtjs/axios'
  ],
  axios: {
    baseURL: `http://localhost:${process.env.PORT || 3030}/`,
    browserBaseURL: "/"
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
