import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
function guardMyroute(to, from, next)
{
 let isAuthenticated= false;
//this is just an example. You will have to find a better or 
// centralised way to handle you localstorage data handling 
console.log(localStorage.getItem('LoggedUser'));
if(localStorage.getItem('LoggedUser'))
  isAuthenticated = true;
 else
  isAuthenticated= false;
console.log(isAuthenticated,'isAuthenticated');
 if(isAuthenticated) 
 {
  next(); // allow to enter route
 } 
 else
 {
  next('/'); // go to '/login';
 }
}

const routes = [
  {
    path: '/Home',
    beforeEnter : guardMyroute,
    name: 'Home',
    component: Home
  },
  {
    path: '/',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },
  {
    path: '/login-stow',
    name: 'login-stow',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/login-stow.vue')
  },
  {
    path: '/login-harvest',
    name: 'login-harvest',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/login-harvest.vue')
  },
  {
    path: '/login-milling',
    name: 'login-milling',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/login-milling.vue')
  },
  {
    path: '/check',
    beforeEnter : guardMyroute,
    name: 'check',
    component: () => import('../views/check.vue')
  },
  {
    path: '/reader',
    name: 'reader',
    component: () => import('../views/qrcode-reader.vue')
  },
  {
    path: '/qr',
    beforeEnter : guardMyroute,
    name: 'qr',
    component: () => import('../views/qr.vue')
  },
  {
    path: '/qr-Rongsi',
    name: 'qr-Rongsi',
    beforeEnter : guardMyroute,
    component: () => import('../views/qr-Rongsi.vue')
  },
  {
    path: '/qr-stow',
    name: 'qr-stow',
    beforeEnter : guardMyroute,
    component: () => import('../views/qr-stow.vue')
  },
  {
    path: '/produc',
    name: 'produc',
    component: () => import('../views/produc.vue')
  },
  {
    path: '/harvest1',
    beforeEnter : guardMyroute,
    name: 'harvest1',
    component: () => import('../views/harvest1.vue')
  },
  {
    path: '/harvest2',
    beforeEnter : guardMyroute,
    name: 'harvest2',
    component: () => import('../views/harvest2.vue')
  },
  {
    path: '/dropdown',
    name: 'dropdown',
    component: () => import('../views/dropdown.vue')
  },
  {
    path: '/milling1',
    beforeEnter : guardMyroute,
    name: 'milling1',
    component: () => import('../views/Milling1.vue')
  },
  {
    path: '/milling2',
    beforeEnter : guardMyroute,
    name: 'milling2',
    component: () => import('../views/Milling2.vue')
  },
  {
    path: '/milling3',
    beforeEnter : guardMyroute,
    name: 'milling3',
    component: () => import('../views/Milling3.vue')
  },
  {
    path: '/milling4',
    beforeEnter : guardMyroute,
    name: 'milling4',
    component: () => import('../views/Milling4.vue')
  },
  {
    path: '/stow1',
    beforeEnter : guardMyroute,
    name: 'stow1',
    component: () => import('../views/stow1.vue')
  },
  {
    path: '/stow2',
    beforeEnter : guardMyroute,
    name: 'stow2',
    component: () => import('../views/stow2.vue')
  },
  {
    path: '/stow3',
    beforeEnter : guardMyroute,
    name: 'stow3',
    component: () => import('../views/stow3.vue')
  },
  {
    path: '/show',
    name: 'show',
    component: () => import('../views/show.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router