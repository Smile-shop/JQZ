const router = {
  path: 'home',
  component: () => import('@/views/super-crm/home/index.vue'),
  meta: {
    title: '',
    icon: '',
  },
  children: [
  ]
}

export default router;