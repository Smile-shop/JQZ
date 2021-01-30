const router = {
  path: 'home',
  component: () => import('@/views/super-mkt/home/index.vue'),
  meta: {
    title: '',
    icon: '',
  },
  children: [
  ]
}

export default router;