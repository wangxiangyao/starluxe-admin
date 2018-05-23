import Vue from 'vue';

import VueRouter from 'vue-router';
import orderRouter from './orderRouter.js';
import commodityRouter from './commodityRouter.js';

import member from '@/pages/member/member.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/home'
    },
    {
      name: 'home',
      path: '/home',
      component: () => import('@/pages/home/home.vue')
    },
    {
      name: 'member',
      path: '/member',
      component: member
    },
    ...orderRouter,
    ...commodityRouter
  ]
});

export default router;
