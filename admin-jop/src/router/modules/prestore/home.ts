const router = {
  path: 'home',
  component: () => import('@/views/fission/home/index.vue'),
  meta: {
    title: '',
    icon: '',
  },
  redirect: '/prestore/distri-manage/activity-list',
  children: [
  ]
}

export default router;
