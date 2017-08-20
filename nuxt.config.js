module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      // { name: 'viewport', content: 'width=device-width, initial-scale=1' },//flexible
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    {
      src: 'static/sass/base.sass',
      lang: 'sass?indentedSyntax=true'
    },
    {
      src: 'swiper/dist/css/swiper.css'
    }
  ],
  plugins: [
    { src: '~plugins/swiper.js', ssr: false },
    { src: '~plugins/flexible.js', ssr: false },//适配移动端
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' }
}
