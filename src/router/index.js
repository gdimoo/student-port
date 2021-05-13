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
    name: 'intro',
    component: () => import('../views/intro.vue')
  },
  {
    path: '/login-training',
    name: 'login-training',
    component: () => import('../views/login-training.vue')
  },
  {
    path: '/login-student',
    name: 'login-student',
    component: () => import('../views/login-student.vue')
  },
  {
    path: '/login-teacher',
    name: 'login-teacher',
    component: () => import('../views/login-teacher.vue')
  },
  {
    path: '/recieve',
    name: 'recieve',
    component: () => import('../views/recieve.vue')
  },
  {
    path: '/data-center',
    beforeEnter : guardMyroute,
    name: 'data-center',
    component: () => import('../views/data-center.vue')
  },
  {
    path: '/certificate',
    beforeEnter : guardMyroute,
    name: 'certificate',
    component: () => import('../views/certificate.vue')
  },
  {
    path: '/request',
    beforeEnter : guardMyroute,
    name: 'request',
    component: () => import('../views/request.vue')
  },
  {
    path: '/school',
    beforeEnter : guardMyroute,
    name: 'school',
    component: () => import('../views/school.vue')
  },
  {
    path: '/training',
    beforeEnter : guardMyroute,
    name: 'training',
    component: () => import('../views/training.vue')
  },
  {
    path: '/study_report1',
    beforeEnter : guardMyroute,
    name: 'study_report1',
    component: () => import('../views/study-report1.vue')
  },
  {
    path: '/study_report2',
    beforeEnter : guardMyroute,
    name: 'study_report2',
    component: () => import('../views/study-report2.vue')
  },
  {
    path: '/student',
    beforeEnter : guardMyroute,
    name: 'student',
    component: () => import('../views/student.vue')
  },
  {
    path: '/add-student',
    beforeEnter : guardMyroute,
    name: 'add-student',
    component: () => import('../views/add-student.vue')
  },
  {
    path: '/cert1',
    beforeEnter : guardMyroute,
    name: 'cert1',
    component: () => import('../views/cert1.vue')
  },
  {
    path: '/cert2',
    beforeEnter : guardMyroute,
    name: 'cert2',
    component: () => import('../views/cert2.vue')
  },
  {
    path: '/transcript',
    beforeEnter : guardMyroute,
    name: 'transcript',
    component: () => import('../views/transcript.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router