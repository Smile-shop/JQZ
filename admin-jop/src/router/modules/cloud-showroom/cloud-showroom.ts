const cloudShowroomRouter = {
  path: 'cloud-showroom',
  component: () => import('@/views/cloud-showroom/cloud-showroom/index.vue'),
  meta: {
  },
  children: [
    {
      path: 'page-settings',
      component: () => import('@/views/cloud-showroom/cloud-showroom/page-settings/index.vue'),
      meta: {
        title: '页面设置',
        icon: 'icon-baodan',
      },
    },
    {
      path: 'online-classify',
      component: () => import('@/views/cloud-showroom/cloud-showroom/online-classify/index.vue'),
      meta: {
        title: '热门分类管理',
        icon: 'icon-baodan',
      },
    },
    {
      path: 'recommend',
      component: () => import('@/views/cloud-showroom/cloud-showroom/recommend/index.vue'),
      meta: {
        title: '推荐位管理',
        icon: 'icon-baodan',
      },
      redirect: '/cloud-showroom/cloud-showroom/recommend/carousel',
      children: [
        {
          path: 'carousel',
          component: () => import('@/views/cloud-showroom/cloud-showroom/recommend/Carousel.vue'),
          meta: {
            title: '推荐位管理',
            icon: 'icon-baodan',
          },
        },
        {
          path: 'type',
          component: () => import('@/views/cloud-showroom/cloud-showroom/recommend/Type.vue'),
          meta: {
            title: '推荐位管理',
            icon: 'icon-baodan',
          },
        },
        {
          path: 'list-1',
          component: () => import('@/views/cloud-showroom/cloud-showroom/recommend/RecommendOne.vue'),
          meta: {
            title: '推荐位管理',
            icon: 'icon-baodan',
            number: 1
          },
        },
        {
          path: 'list-2',
          component: () => import('@/views/cloud-showroom/cloud-showroom/recommend/RecommendTwo.vue'),
          meta: {
            title: '推荐位管理',
            icon: 'icon-baodan',
            number: 2
          },
        },
      ]
    },
    {
      path: 'classify-search',
      component: () => import('@/views/cloud-showroom/cloud-showroom/classify-search/index.vue'),
      meta: {
        title: '分类搜索管理',
        icon: 'icon-baodan',
      },
    },
    {
      path: 'screen-search',
      component: () => import('@/views/cloud-showroom/cloud-showroom/screen-search/index.vue'),
      meta: {
        title: '筛选管理',
        icon: 'icon-baodan',
      },
    },
    {
      path: 'shelves',
      component: () => import('@/views/cloud-showroom/cloud-showroom/shelves/index.vue'),
      meta: {
        title: '上架管理',
        icon: 'icon-baodan',
      },
    },
    {
      path: 'clientele',
      component: () => import('@/views/cloud-showroom/cloud-showroom/clientele/index.vue'),
      meta: {
        title: '客户管理',
        icon: 'icon-baodan',
      },
    },
    {
      path: 'order-record',
      component: () => import('@/views/cloud-showroom/cloud-showroom/order-record/index.vue'),
      redirect: '/cloud-showroom/cloud-showroom/order-record/index',
      meta: {
        title: '订单记录',
        icon: 'icon-baodan',
        // isIgnore: true,
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/cloud-showroom/cloud-showroom/order-record/components/order-record.vue'),
          meta: {
            title: '订单记录',
            icon: 'icon-baodan',
            // isIgnore: true,
          },
        },
        {
          path: 'order-detail',
          component: () => import('@/views/cloud-showroom/cloud-showroom/order-record/components/order-detail.vue'),
          meta: {
            title: '订单记录',
            icon: 'icon-baodan',
            // isIgnore: true,
          },
        }
      ]
    },
    {
      path: 'wx-auth',
      component: () => import('@/views/cloud-showroom/cloud-showroom/wx-auth/index.vue'),
      redirect: '',
      meta: {
        title: '小程序绑定',
        icon: 'icon-gongzhonghao',
      },
    }
  ]
}


export default cloudShowroomRouter
