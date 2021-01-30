const router =  {
  path: 'order-manage',
  component: () => import('@/views/fission/distri-manage/index.vue'),
  redirect: '/fission/order-manage/orderList',
  meta: {
    title: '订单管理',
    icon: 'icon-iconfuxing_lipin',
  },
  children: [
    {
      path: 'orderList',
      component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/orderList/index.vue'),
      meta: {
        title: '订单列表',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    {
      path: 'writeOffList',
      component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/writeOffList/index.vue'),
      meta: {
        title: '核销员管理',
        icon: 'icon-iconfuxing_lipin',
      },
    },
  ],
}

export default router;
