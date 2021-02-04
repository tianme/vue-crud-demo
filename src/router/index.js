import Vue from 'vue';
import VueRouter from 'vue-router';
import register from '../views/user/register.vue';
// import list from '../views/user/list.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'register',
    component: register,
  },
  {
    path: '/user/list',
    name: 'user-list',
    component: () => import(/* webpackChunkName: "about" */ '../views/user/list'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
