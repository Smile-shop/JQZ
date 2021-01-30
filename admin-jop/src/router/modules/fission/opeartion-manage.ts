const router =  {
  path: 'opeartion-manage',
  component: () => import('@/views/fission/distri-manage/index.vue'),
  redirect: '/fission/opeartion-manage/activityFeedback',
  meta: {
    title: '运营管理',
    icon: 'icon-iconfuxing_lipin',
  },
  children: [
    // 暂不开发
    // {
    //   path: 'activityData',
    //   // component: () => import('@/views/fission/distri-manage/activity-list/index.vue'),
    //   meta: {
    //     title: '活动数据',
    //     icon: 'icon-iconfuxing_lipin',
    //   },
    // },
    {
      path: 'activityFeedback',
      component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/operation/activityFeedback.vue'),
      meta: {
        title: '活动反馈',
        icon: 'icon-iconfuxing_lipin',
      },
    },
  ],
}

export default router;
