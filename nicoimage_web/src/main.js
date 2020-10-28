// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueLazyload from 'vue-lazyload'

import './assets/css/global.css'

Vue.config.productionTip = false

// import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888'

// axios接口调用前的拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

// import Cookies from 'js-cookie'
Vue.prototype.$cookie = Cookies

Vue.use(VueLazyload, {
  loading: require('./assets/loading.gif')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
