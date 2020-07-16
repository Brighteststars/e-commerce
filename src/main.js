import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'local') {
    axios.defaults.baseURL = 'http://127.0.0.1:9090'
} else if (process.env.NODE_ENV === 'debug') {
    axios.defaults.baseURL = ''
} else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = ''
}

axios.defaults.timeout = 5000

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 为请求对象，添加Token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

Vue.prototype.$http = axios

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
