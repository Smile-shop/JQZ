export default {
  path: 'store-set',
  component: () => import('@/views/system-set/store-set/index.vue'),
  meta: {
  },
  children: [
    {
      path: 'store-manage',
      component: () => import('@/views/system-set/store-set/index.vue'),
      redirect: '/system-set/store-set/store-manage/store-manage-set',
      meta: {
        title: '门店管理',
        icon: 'icon-mendian1',
      },
      children: [
        {
          path: 'store-manage-set',
          component: () => import('@/views/system-set/store-set/store-manage/index.vue'),
          meta: {
            title: '门店管理',
            icon: 'icon-mendian1',
          },
          children: [
          ]
        }
      ]
    },
  ]
}