const router =  {
  path: 'withdraw-manage',
  component: () => import('@/views/fission/distri-manage/index.vue'),
  redirect: '/fission/withdraw-manage/withdrawList',
  meta: {
    title: '资金管理',
    icon: 'icon-jinqian-fanli',
  },
  children: [
    {
      path: 'moneyDetail',
      component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/money-manage/moneyDetail.vue'),
      meta: {
        title: '资金明细',
        icon: 'icon-jinqian-fanli',
      },
    },
    {
      path: 'withdrawList',
      component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/money-manage/index.vue'),
      redirect: '/fission/withdraw-manage/withdrawList/withdrawListMain',
      meta: {
        title: '资金明细',
        icon: 'icon-jinqian-fanli',
      },
      children: [
        {
          path: 'withdrawListMain',
          component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/money-manage/withdrawList.vue'),
          meta: {
            title: '提现列表',
            icon: 'icon-jinqian-fanli',
          },
        },
        {
          path: 'withdrawApply',
          component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/money-manage/applyWithDraw.vue'),
          meta: {
            title: '提现申请',
            icon: 'icon-jinqian-fanli',
          },
        },
    ]
    }
  ],
}

export default router;
