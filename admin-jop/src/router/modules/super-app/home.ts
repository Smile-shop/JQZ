const router = {
  path: 'home',
  component: () => import('@/views/super-app/home/index.vue'),
  meta: {
    title: '',
    icon: '',
  },
  children: [
  ]
}

export default router;