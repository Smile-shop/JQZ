const router = {
  path: 'home',
  component: () => import('@/views/fission/home/index.vue'),
  meta: {
    title: '',
    icon: '',
  },
  redirect: '/fission/distri-manage/activity-list',
  children: [
  ]
}

export default router;
