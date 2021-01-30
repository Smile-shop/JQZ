const wxMallRouter = {
  path: 'wx-mall',
  component: () => import('@/views/super-crm/wx-mall/index.vue'),
  redirect: '/super-crm/wx-mall/page-set',
  meta: {
  },
  children: [
    // 界面设置
    {
      path: 'page-set',
      component: () => import('@/views/super-crm/wx-mall/page-set/index.vue'),
      meta: {
        title: '界面设置',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 门店设置
    {
      path: 'shop-set',
      component: () => import('@/views/super-crm/wx-mall/shop-set/index.vue'),
      meta: {
        title: '门店设置',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 商品详情编辑
    {
      path: 'product-detail',
      component: () => import('@/views/super-crm/wx-mall/product-detail/index.vue'),
      meta: {
        title: '商品详情编辑',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 商品搜索设置
    {
      path: 'product-search',
      component: () => import('@/views/super-crm/wx-mall/product-search/index.vue'),
      meta: {
        title: '商品搜索设置',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 详情参数设置
    {
      path: 'show-param',
      component: () => import('@/views/super-crm/wx-mall/show-param/index.vue'),
      meta: {
        title: '详情参数设置',
        icon: 'icon-iconfuxing_lipin',
      },
    }
  ]
}

export default wxMallRouter;