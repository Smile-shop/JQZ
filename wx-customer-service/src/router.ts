import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Complain from './views/Complain.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        titleName: '我的客服顾问',
        hasNav: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      component: About,
      meta: {
        titleName: '客服',
        hasNav: true
      }
    },
    {
      path: '/complain',
      name: 'complain',
      component: Complain,
      meta: {
        titleName: '投诉通道',
        hasNav: true
      }
    }
  ]
});
