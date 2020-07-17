import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/gobal.css'
import axios from 'axios'
import Header from './components/Header.vue'
import LoginUserDesc from './components/private/LoginUserDesc.vue'
import { pattern, timeago } from './assets/js/DateFormat.js'
import './assets/iconfont/iconfont.css'
Vue.prototype.$DateUtils = {}
Vue.prototype.$DateUtils.pattern = pattern
Vue.prototype.$DateUtils.timeago = timeago

// 把Header注册成全局组件
var hub = new Vue()
// hub 为公共事件祖册中心
Vue.prototype.$hub = hub
Vue.prototype.$http = axios
Vue.prototype.$baseServer = 'http://localhost:8081'
axios.defaults.baseURL = 'http://localhost:8081'
axios.interceptors.response.use(function(res) {
  var data = res.data
  if (data.token != null) {
    window.localStorage.setItem('token', data.token)
  }
  if (data.status === 402) { // 401 token empty 402 token exipre
    Vue.prototype.$message.error('信息已过期，请重新登录')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('loginUser')
    window.location.reload()
  }
  return data
}, function(err) {
  Vue.prototype.$message.error('服务器繁忙')
  console.log(err)
  return err
})
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
}, function(err) {
  Vue.prototype.$message.error('服务器繁忙')
  console.log(err)
})
Vue.component('loginuser-desc', LoginUserDesc)
Vue.component('myheader', Header)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
