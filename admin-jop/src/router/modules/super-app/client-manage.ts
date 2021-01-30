const router = {
  path: 'client-manage',
  component: () => import('@/views/super-app/client-manage/index.vue'),
  redirect: '/super-app/client-manage/system-set',
  meta: {
  },
  children: [
    // 客资管理系统设置
    {
      path: 'system-set',
      component: () => import('@/views/super-app/client-manage/system-set/index.vue'),
      meta: {
        title: '基础资料维护',
        icon: 'icon-price',
      },
      redirect: '/super-app/client-manage/system-set/base-info-manage',
      children: [
        {
          path: 'base-info-manage',
          component: () => import('@/views/super-app/client-manage/system-set/pages/BasisData.vue'),
          meta: {
            title: '基础资料维护',
            icon: 'icon-shezhi1',
          },
        },
      ]
    },
    // 数据统计
    {
      path: 'data-count',
      component: () => import('@/views/super-app/client-manage/data-count/index.vue'),
      meta: {
        title: '数据统计',
        icon: 'icon-price',
      },
      redirect: '/super-app/client-manage/data-count/pool-count',
      children: [
        {
          path: 'pool-count',
          component: () => import('@/views/super-app/client-manage/data-count/pages/PoolCount.vue'),
          meta: {
            title: '线索池统计',
            icon: 'icon-xiansuochi',
          },
        },
        {
          path: 'custom-clue-count',
          component: () => import('@/views/super-app/client-manage/data-count/pages/CustomClueCount.vue'),
          meta: {
            title: '潜在客统计',
            icon: 'icon-kezixiansuo',
          },
        },
        {
          path: 'custom-count',
          component: () => import('@/views/super-app/client-manage/data-count/pages/CustomCount.vue'),
          meta: {
            title: '目标客统计',
            icon: 'icon-kezikehu',
          },
        },
        {
          path: 'custom-gs-count',
          component: () => import('@/views/super-app/client-manage/data-count/pages/CustomGsCount.vue'),
          meta: {
            title: '客户池统计',
            icon: 'icon-kehugonghai',
          },
        },
      ]
    },
  ]
}

export default router;