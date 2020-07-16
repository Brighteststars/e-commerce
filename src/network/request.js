import axios from 'axios'

if (process.env.NODE_ENV === 'local') {
    axios.defaults.baseURL = 'http://127.0.0.1:9090'
} else if (process.env.NODE_ENV === 'debug') {
    axios.defaults.baseURL = ''
} else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = ''
}

axios.defaults.timeout = 5000

const instance = axios.create({})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log('全局请求拦截器')
    // console.log(config)
    // 为请求对象，添加Token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log('全局响应拦截器')
    // console.log(response)
    return response
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
})

function get(url, params = {}) {
    return instance.get(url, params)
}

function post(url, data) {
    return instance.post(url, data)
}

function put(url, data) {
    return instance.put(url, data)
}

function del(url) {
    return instance.delete(url)
}

// success failure (通过函数指针调用的函数, 称为回调函数)
// export function request (config) {
//     // return new Promise((resolve, reject) => {
//     //     // 真正的网络请求
//     //     axios(config).then(res => {
//     //         resolve(res)
//     //     }).catch(error => {
//     //         reject(error)
//     //     })
//     // })
//     return instance(config)
// }

export { get, post, put, del }
