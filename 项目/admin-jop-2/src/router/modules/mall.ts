import { RouteConfig } from 'vue-router';

export const mallRoute: RouteConfig = {
  path: '/mall',
  component: () => import('@/layout/layout-main.vue'),
  children: [
    // 商品管理
    {
      path: 'goods-manage',
      component: () => import('@/layout/page-router-view.vue'),
      children: [
        {
          path: 'classification',
          component: () => import('@/views/modules/mall/goods-manage/classification/index.vue'),
        },
        {
          path: 'product-list',
          component: () => import('@/layout/page-router-view.vue'),
          children: [
            {
              path: '',
              component: () => import('@/views/modules/mall/goods-manage/product-list/index.vue')
            },
            {
              path: 'product-info',
              component: () => import('@/views/modules/mall/goods-manage/product-list/product-info.vue'),
            },
            {
              path: 'product-detail',
              component: () => import('@/views/modules/mall/goods-manage/product-list/product-detail.vue'),
            },
            {
              path: 'product-specification',
              component: () => import('@/views/modules/mall/goods-manage/product-list/product-specification.vue'),
            }
          ]
        },
        {
          path: 'product-set',
          component: () => import('@/views/modules/mall/goods-manage/product-set/index.vue')
        },
      ],
    },
    // 订单管理
    {
      path: 'order',
      component: () => import('@/layout/page-router-view.vue'),
      children: [
        {
          path: 'all',
          component: () => import('@/layout/page-router-view.vue'),
          children: [
            {
              path: '',
              component: () => import('@/views/modules/mall/order/all/index.vue'),
            },
            {
              path: 'order-detail',
              component: () => import('@/views/modules/mall/order/all/components/order-detail.vue')
            },
          ]
        },
        {
          path: 'after-market',
          component: () => import('@/views/modules/mall/order/after-market/index.vue'),
        },
        {
          path: 'evaluation-manage',
          component: () => import('@/layout/page-router-view.vue'),
          children: [
            {
              path: 'evaluation-list',
              component: () => import('@/views/modules/mall/order/evaluation-manage/evaluation-list.vue'),
            },
            {
              path: 'evaluation-setting',
              component: () => import('@/views/modules/mall/order/evaluation-manage/evaluation-setting.vue')
            },
          ]
        },
        {
          path: 'order-setting',
          component: () => import('@/views/modules/mall/order/order-setting/index.vue'),
        },
      ],
    },
    // 会员管理
    {
      path: 'member-manage',
      component: () => import('@/layout/page-router-view.vue'),
      children: [
        {
          path: 'list',
          component: () => import('@/layout/page-router-view.vue'),
          children: [
            {
              path: '',
              component: () => import('@/views/modules/mall/member-manage/index/index.vue'),
            },
            {
              path: 'detail',
              component: () => import('@/views/modules/mall/member-manage/pages/Detail/index.vue'),
            },
            {
              path: 'info',
              component: () => import('@/views/modules/mall/member-manage/pages/Info/index.vue'),
            },
          ]
        },
      ],
    },
    // 门店管理
    {
      path: 'store-manage',
      component: () => import('@/layout/page-router-view.vue'),
      children: [
        {
          path: 'list',
          component: () => import('@/layout/page-router-view.vue'),
          children: [
            {
              path: '',
              component: () => import('@/views/modules/mall/store-manage/index.vue')
            },
            {
              path: 'store-detail',
              component: () => import('@/views/modules/mall/store-manage/storeDetail/index.vue')
            }
          ],
        },
        {
          path: 'store-setting',
          component: () => import('@/views/modules/mall/store-manage/storeSetting/index.vue'),
        }
      ]
    },
    // 店铺管理
    {
      path: 'shop',
      component: () => import('@/layout/page-router-view.vue'),
      children: [
        {
          path: 'home',
          component: () => import('@/layout/page-router-view.vue'),
          children: [
            {
              path: '',
              component: () => import('@/views/modules/mall/shop/home/index.vue')
            },
          ],
        },
      ]
    },
  ],
};
