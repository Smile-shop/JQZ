export default {
  path: 'market-promotion',
  component: () => import('@/views/super-mkt/spread-set/index.vue'),
  redirect: '/super-mkt/market-promotion/promotion-set',
  meta: {
  },
  children: [
    // 奖品管理
    {
      path: 'promotion-set',
      component: () => import('@/views/super-mkt/spread-set/spread-manage/index.vue'),
      meta: {
        title: '奖品管理',
        icon: 'icon-iconfuxing_lipin',
      },
      redirect: '/super-mkt/market-promotion/promotion-set/set-plan',
      children: [
        {
          path: 'set-plan',
          component: () => import('@/views/super-mkt/spread-set/spread-manage/spread-info/index.vue'),
          redirect: '/super-mkt/market-promotion/promotion-set/set-plan/home',
          meta: {
            title: '设置方案',
            icon: 'icon-iconfuxing_lipin',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-mkt/spread-set/spread-manage/spread-info/Home.vue'),
              meta: {
                title: '设置方案',
                icon: 'icon-iconfuxing_lipin',
              },
            },
            {
              path: 'edit',
              component: () => import('@/views/super-mkt/spread-set/spread-manage/spread-info/Edit.vue'),
              meta: {
                title: '设置方案',
                icon: 'icon-iconfuxing_lipin',
              },
            },
          ]
        }
      ]
    },
  ]
}