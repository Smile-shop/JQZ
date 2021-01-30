export default {
  path: 'prize-set',
  component: () => import('@/views/super-mkt/prize-set/index.vue'),
  meta: {
  },
  children: [
    // 奖品管理
    {
      path: 'prize-manage',
      component: () => import('@/views/super-mkt/prize-set/prize-manage/index.vue'),
      meta: {
        title: '奖品管理',
        icon: 'icon-iconfuxing_lipin',
      },
      children: [
        {
          path: 'prize-info',
          component: () => import('@/views/super-mkt/prize-set/prize-manage/prize-info/index.vue'),
          redirect: '/super-mkt/prize-set/prize-manage/prize-info/home',
          meta: {
            title: '奖品信息',
            icon: 'icon-iconfuxing_lipin',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-mkt/prize-set/prize-manage/prize-info/Home.vue'),
              meta: {
                title: '奖品信息',
                icon: 'icon-iconfuxing_lipin',
              },
            },
            {
              path: 'edit',
              component: () => import('@/views/super-mkt/prize-set/prize-manage/prize-info/Edit.vue'),
              meta: {
                title: '奖品信息',
                icon: 'icon-iconfuxing_lipin',
              },
            },
          ]
        }
      ]
    },
  ]
}