// import Vue from 'vue'
// import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login" */'../views/Login.vue')
const Home = () => import(/* webpackChunkName: "home" */'../views/Home.vue')
const Pictures = () =>import(/* webpackChunkName: "home" */'../views/Pictures.vue')
const Upload = () =>import(/* webpackChunkName: "home" */'../views/Upload.vue')
const Api = () =>import(/* webpackChunkName: "home" */'../views/Api.vue')

Vue.use(VueRouter)

  const routes = [
    {path:'/',redirect:'/login'},
    {path: '/login',component: Login},
    {path: '/home',component: Home,redirect:'/upload',children:[
      {path:'/pictures',component:Pictures},
      {path:'/upload',component:Upload},
      {path:'/api',component:Api}
    ]}
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
