const router = {
  path: 'gold-price',
  component: () => import('@/views/super-app/gold-price/index.vue'),
  meta: {
  },
  children: [
    // 界面风格
    {
      path: 'page-style',
      component: () => import('@/views/super-app/gold-price/page-style/index.vue'),
      meta: {
        title: '界面风格',
        icon: 'icon-price',
      },
    },
  ]
}

export default router;