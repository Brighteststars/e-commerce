import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
Vue.use(VueRouter)

const routes = [{
    path: '/', redirect: '/login'
},
{
    path: '/login', component: Login
},
{
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles }
    ]
}
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的函数
    // from 从哪个路径而来
    // next() 放行
    if (to.path === '/login') {
        return next()
    }
    const tokenStr = window.sessionStorage.getItem('token')
    // 如果tokenStr为空, 跳转到登录页
    if (!tokenStr) {
        return next('/login')
    }
    next()
})

export default router
