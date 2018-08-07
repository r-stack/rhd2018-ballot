import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import top from '@/components/top';
import login from '@/components/login';
import vote from '@/components/vote';
import admin from '@/components/admin';
import count from '@/components/count';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'top',
      component: top,
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
    },
    {
      path: '/admin',
      name: 'Admin',
      component: admin,
    },
    {
      path: '/count',
      name: 'Count',
      component: count,
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
