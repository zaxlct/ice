import Vue from 'vue'

if (process.BROWSER_BUILD) {
  const VueAwesomeSwiper = require('vue-awesome-swiper')
  Vue.use(VueAwesomeSwiper)
}
