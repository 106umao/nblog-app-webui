import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './assets/gobal.css'
import { pattern, timeago } from './assets/js/DateFormat.js'
import axios from 'axios'
import './plugins/PartSpareRegist.js' // 全局零件组件注册
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'
import './assets/iconfont/sybmbol.css'
Vue.use(mavonEditor)
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

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
