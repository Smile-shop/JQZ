const router =  {
  path: 'setting',
  component: () => import('@/views/fission/distri-manage/index.vue'),
  redirect: '/prestore/setting/merchantSettings',
  meta: {
    title: '设置',
    icon: 'icon-shezhi1',
  },
  children: [
    {
      path: 'merchantSettings',
      component: () => import('@/views/super-mkt/activity-set/activity-type/prestore/install/merchantInstall.vue'),
      meta: {
        title: '商家设置',
        icon: 'icon-shezhi1',
      },
    },
    {
      path: 'customerSettings',
      component: () => import('@/views/super-mkt/activity-set/activity-type/prestore/install/customerInstall.vue'),
      meta: {
        title: '客服设置',
        icon: 'icon-shezhi1',
      },
    },
    {
      path: 'paySettings',
      component: () => import('@/views/super-mkt/activity-set/activity-type/prestore/paySet/index.vue'),
      meta: {
        title: '支付设置',
        icon: 'icon-shezhi1',
      },
    },
  ],
}

export default router;
