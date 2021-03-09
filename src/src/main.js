// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {firestorePlugin} from 'vuefire'
import VueResource from 'vue-resource'
import VueSession from 'vue-session'
import Loading from 'vue-loading-overlay';
import Vuex from 'vuex'
import 'vue-loading-overlay/dist/vue-loading.css';
import {auth} from "./model/db";
import Vuetify from "vuetify";


import 'bootstrap'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuetify);


Vue.use(VueResource)

Vue.use(VueSession)

Vue.use(firestorePlugin)

Vue.use(Loading);

//filters
Vue.filter("formatBill", function (bill) {
  return new Intl.NumberFormat('vi-VI', {maximumSignificantDigits: 3}).format(bill)
})

Vue.filter("billMethod", function (billMethod) {
  switch (billMethod) {
    case 'EWALLET':
      return "Ví điện tử";
    case 'TRANSFER':
      return "Chuyển khoản";
    case 'CASH':
      return "Tiền mặt";
    default:
      return "Unknown method"
  }
})

Vue.filter("statusFormat", function (status) {
  switch (status) {

    case 'WAITING':
      return "Đang chờ";
    case 'COOKING':
      return "Đang chuẩn bi";
    case 'SHIPPING':
      return "Đang giao hàng";
    case 'COMPLETE':
      return "Hoàn thành";
    case 'CANCEL':
      return "Bị hủy";
    default:
      return "Unknown status"
  }
})

Vue.filter('formatTimeCreated', function (timestamp) {
  if (timestamp)
    return timestamp.toDate().toLocaleString("vi-Vi", {timeZone: "Asia/Ho_Chi_Minh"})
  return ''
})
Vue.filter('shortenSentence', function (sentence) {
  return sentence.substring(0, 50) + " ..."
})

Vue.filter('sizeFormat', function (size) {
  switch (size) {
    case 1:
      return "Nhỏ"
    case 2:
      return "Vừa"
    case 3:
      return "Lớn"
    default:
      return "Unknown size"
  }
})

auth.onAuthStateChanged(function (user) {
  new Vue({
    el: '#app',
    store: store,
    router: router,
    components: {App},
    template: '<App/>'
  })
})
