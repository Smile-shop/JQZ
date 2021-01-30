const router =  {
  path: 'withdraw-manage',
  component: () => import('@/views/fission/distri-manage/index.vue'),
  redirect: '/prestore/withdraw-manage/withdrawList',
  meta: {
    title: '资金管理',
    icon: 'icon-jinqian-fanli',
  },
  children: [
    {
      path: 'moneyDetail',
      component: () => import('@/views/super-mkt/activity-set/activity-type/prestore/money-manage/moneyDetail.vue'),
      meta: {
        title: '资金明细',
        icon: 'icon-jinqian-fanli',
      },
    },
    {
      path: 'withdrawList',
      component: () => import('@/views/super-mkt/activity-set/activity-type/prestore/money-manage/index.vue'),
      redirect: '/prestore/withdraw-manage/withdrawList/withdrawListMain',
      meta: {
        title: '资金明细',
        icon: 'icon-jinqian-fanli',
      },
      children: [
        {
          path: 'withdrawListMain',
          component: () => import('@/views/super-mkt/activity-set/activity-type/prestore/money-manage/withdrawList.vue'),
          meta: {
            title: '财务对账',
            icon: 'icon-jinqian-fanli',
          },
        },
      ]
    }
  ],
}

export default router;
