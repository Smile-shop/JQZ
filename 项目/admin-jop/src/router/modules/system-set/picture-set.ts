export default {
  path: 'picture-set',
  component: () => import('@/views/system-set/picture-set/index.vue'),
  meta: {
  },
  children: [
    {
      path: 'picture-get',
      component: () => import('@/views/system-set/picture-set/picture-get/index.vue'),
      redirect: '/system-set/picture-set/picture-get/picture-get-update',
      meta: {
        title: '图片访问',
        icon: 'icon-tupian',
      },
      children: [
        {
          path: 'picture-get-update',
          component: () => import('@/views/system-set/picture-set/picture-get/PictureGetUpdate.vue'),
          meta: {
            title: '图片访问设置',
            icon: 'icon-tupian',
          },
          children: [
          ]
        }
      ]
    },
  ]
}