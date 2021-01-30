const wxMallRouter = {
  path: 'wx-mall',
  component: () => import('@/views/super-crm/wx-mall/index.vue'),
  meta: {
  },
  children: [
    // 界面设置
    {
      path: 'page-set',
      component: () => import('@/views/super-crm/wx-mall/page-set/index.vue'),
      name: 'page-set',
      meta: {
        title: '界面设置',
        icon: 'icon-shangcheng',
      },
    },
    // 门店设置
    {
      path: 'shop-set',
      component: () => import('@/views/super-crm/wx-mall/shop-set/index.vue'),
      meta: {
        title: '门店设置',
        icon: 'icon-shangcheng',
      },
    },
    // 商品详情编辑
    {
      path: 'product-detail',
      component: () => import('@/views/super-crm/wx-mall/product-detail/index.vue'),
      meta: {
        title: '商品详情编辑',
        icon: 'icon-shangcheng',
      },
    },
    // 商品搜索设置
    {
      path: 'product-search',
      component: () => import('@/views/super-crm/wx-mall/product-search/index.vue'),
      meta: {
        title: '商品搜索设置',
        icon: 'icon-shangcheng',
      },
    },
    // 详情参数设置
    {
      path: 'show-param',
      component: () => import('@/views/super-crm/wx-mall/show-param/index.vue'),
      meta: {
        title: '详情参数设置',
        icon: 'icon-shangcheng',
      },
    },
    // 列表参数设置
    {
      path: 'list-param',
      component: () => import('@/views/super-crm/wx-mall/list-param/index.vue'),
      meta: {
        title: '列表参数设置',
        icon: 'icon-shangcheng',
      },
    },
    // 邮寄方式设置
    {
      path: 'post-method',
      component: () => import('@/views/super-crm/wx-mall/post-method/index.vue'),
      meta: {
        title: '邮寄方式设置',
        icon: 'icon-shangcheng',
      },
    },
    // 商品分享设置
    {
      path: 'share',
      component: () => import('@/views/super-crm/wx-mall/share/index.vue'),
      meta: {
        title: '商品分享设置',
        icon: 'icon-shangcheng',
      },
    },
    // 商品分享设置
    {
      path: 'guide',
      component: () => import('@/views/super-crm/wx-mall/guide/index.vue'),
      meta: {
        title: '公众号关注引导设置',
        icon: 'icon-shangcheng',
      },
    },
    // 导购销售统计
    {
      path: 'salesman-sales-data',
      component: () => import('@/views/super-crm/wx-mall/salesman-sales-data/index.vue'),
      meta: {
        title: '导购销售统计',
        icon: 'icon-shangcheng',
      },
      children: [
        {
          path: '/',
          component: () => import('@/views/super-crm/wx-mall/salesman-sales-data/Home.vue'),
          meta: {
            title: '导购销售统计',
            icon: 'icon-shangcheng',
          },
        },
        {
          path: 'detail',
          component: () => import('@/views/super-crm/wx-mall/salesman-sales-data/Detail.vue'),
          meta: {
            title: '导购销售统计明细',
            icon: 'icon-shangcheng',
          },
        },
      ]
    },
  ]
}

export default wxMallRouter;
