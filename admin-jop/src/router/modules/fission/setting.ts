const router =  {
  path: 'setting',
  component: () => import('@/views/fission/distri-manage/index.vue'),
  redirect: '/fission/setting/merchantSettings',
  meta: {
    title: '设置',
    icon: 'icon-iconfuxing_lipin',
  },
  children: [
    {
      path: 'merchantSettings',
      component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/install/merchantInstall.vue'),
      meta: {
        title: '商家设置',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    {
      path: 'customerSettings',
      component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/install/customerInstall.vue'),
      meta: {
        title: '客服设置',
        icon: 'icon-iconfuxing_lipin',
      },
    },
  ],
}

export default router;
