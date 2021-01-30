const router = {
  path: 'home',
  component: () => import('@/views/cloud-showroom/home/index.vue'),
  meta: {
    title: '',
    icon: '',
  },
  redirect: '/cloud-showroom/cloud-showroom/page-settings',
  children: [
  ]
}

export default router;
