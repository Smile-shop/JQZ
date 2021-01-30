const pointMallRouter = {
  path: 'point-mall',
  component: () => import('@/views/super-crm/point-mall/index.vue'),
  redirect: '/super-crm/point-mall/shop-set',
  meta: {
  },
  children: [
    // 门店设置
    {
      path: 'shop-set',
      component: () => import('@/views/super-crm/point-mall/shop-set/index.vue'),
      meta: {
        title: '门店设置',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 界面设置
    {
      path: 'view-set',
      component: () => import('@/views/super-crm/point-mall/view-set/index.vue'),
      meta: {
        title: '界面设置',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 礼品详情编辑
    {
      path: 'product-detail-edit',
      component: () => import('@/views/super-crm/point-mall/product-detail-edit/index.vue'),
      meta: {
        title: '礼品详情编辑',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 礼品兑换记录
    {
      path: 'exchange-history',
      component: () => import('@/views/super-crm/point-mall/exchange-history/index.vue'),
      meta: {
        title: '礼品兑换记录',
        icon: 'icon-iconfuxing_lipin',
      },
    }
  ]
}

export default pointMallRouter;