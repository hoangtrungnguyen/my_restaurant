// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { firestorePlugin } from 'vuefire'
import VueResource from 'vue-resource'
import VueSession from 'vue-session'

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


Vue.use(VueResource)

Vue.use(VueSession)

Vue.use(firestorePlugin)

//filters
Vue.filter("formatBill",function (bill){
   return new Intl.NumberFormat('vi-VI', { maximumSignificantDigits: 3 }).format(bill)
})

new Vue({
  el: '#app',
  router: router,
  components: { App },
  template: '<App/>'
})
