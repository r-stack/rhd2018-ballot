import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import top from '@/components/top.vue';
import login from '@/components/login.vue';
import vote from '@/components/vote.vue';
import admin from '@/components/admin.vue';
import count from '@/components/count.vue';

import { auth, checkCurrentUser } from '@/firebase';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/soon',
      name: 'top',
      component: top,
    },
    {
      path: '/game',
      name: 'game',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Game.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: login,
    },
    {
      path: '/vote',
      name: 'Vote',
      component: vote,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: admin,
      meta: { requiresAuth: true },
    },
    {
      path: '/count',
      name: 'Count',
      component: count,
      meta: { requiresAuth: true },
    },
    {
      path: '*',
      redirect: '/soon',
    },
  ],
});

// 認証チェック
router.beforeEach(async (to, from, next) => {
  if (!auth.currentUser) {
    await checkCurrentUser();
  }
  console.log('router: check auth %s', auth.currentUser);
  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.currentUser) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
