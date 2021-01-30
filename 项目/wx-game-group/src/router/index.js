import Vue from 'vue'
import Router from 'vue-router'

import JggIndex from '@/views/Jiugongge'
import Flop from '@/views/Flop'
import RedEnvelope from '@/views/RedEnvelope'
import Tigger from '@/views/Tigger'
import giftdetail from '@/views/common/giftdetail.vue'
import Rule from '@/views/common/Rule.vue';
import Home from '@/views/index.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },  
    {
      path: '/flop',
      name: 'flop',
      component: Flop
    },
    {
      path: '/jggIndex',
      name: 'jggIndex',
      component: JggIndex
    },
    {
      path: '/giftdetail',
      name: 'giftdetail',
      component: giftdetail
    },
    {
      path: '/Rule',
      name: 'Rule',
      component: Rule
    },
    {
      path: '/tigger',
      name: 'tigger',
      component: Tigger,
    },
    {
      path: '/redenvelope',
      name: 'redenvelope',
      component: RedEnvelope,
    },
    {
      path: '/cat-and-mouse',
      name: 'catAndMouse',
      component: () => import('../views/cat-and-mouse/index.vue'),
    },
  ]
})