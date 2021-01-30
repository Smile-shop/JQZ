const router =  {
  path: 'distri-manage',
  component: () => import('@/views/fission/distri-manage/index.vue'),
  redirect: '/fission/distri-manage/activity-list/index',
  meta: {
    title: '分销管理',
    icon: 'icon-fenxiaoshang',
  },
  children: [
    {
      path: 'activity-list',
      component: () => import('@/views/fission/distri-manage/index.vue'),
      redirect: '/fission/distri-manage/activity-list/index',
      meta: {
        title: '活动列表',
        icon: 'icon-iconfuxing_lipin',
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/Home.vue'),
          meta: {
            title: '活动列表',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'channelPopularize',
          component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/channelPopularize/index.vue'),
          meta: {
            title: '渠道推广',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'add',
          component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/Add.vue'),
          meta: {
            title: '活动信息',
            icon: 'icon-iconfuxing_lipin',
          },
        }
      ]
    },
    {
      path: 'activity-user-list',
      component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/userList/index.vue'),
      meta: {
        title: '活动用户',
        icon: 'icon-iconfuxing_lipin',
      },
    },
  ],
}

export default router;
