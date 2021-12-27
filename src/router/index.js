import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        component: () => import('../views/derivative/ClueLead.vue')
      },
      {
        path: 'ClueLead',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/derivative/ClueLead.vue')
      },
      {
        path: 'AssignCustomer',
        component: () => import('../views/derivative/AssignCustomer.vue')
      },
      {
        path: 'AddTargetDepartment',
        component: () => import('../views/derivative/AddTargetDepartment.vue')
      }
    ]
  },
  {
    path: '/mobileHome',
    name: 'mobileHome',
    component: () => import('../views/mobileHome.vue')
  },
  {
    path: '/errorpage',
    name: 'errorPage',
    component: () => import('../views/errorpage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
