import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from '../util/axios'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/sign',
    name: 'sign',
    component: () => import('../views/sign.vue')
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  try {
    var token = JSON.parse(localStorage.getItem("user")).token;
  } catch (error) {
    if (!(to.name == 'login' || to.name == 'sign')) {
      router.push({ name: 'login' })
    }
  }
  if (token && to.name == 'index') {
    // 验证登录状态
    axios
      .post(
        "/status",
        { token },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      .then(res => {
        if (res.data.status == "fail") {
          this.$router.push({ name: "login" });
        }
      });
  }
  next()
})

export default router
