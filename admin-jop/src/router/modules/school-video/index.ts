const router = {
  path: 'index',
  component: () => import('@/views/school-video/index.vue'),
  redirect: '/school-video/index/list/:type',
  meta: {
    title: '金千枝商学院',
    icon: '',
  },
  children: [
    {
      path: 'list/:type',
      component: () => import('@/views/school-video/child/videoList.vue'),
      meta: {
        title: '金千枝商学院',
        icon: '',
      },
      children: [

      ]
    },
    {
      path: 'player',
      component: () => import('@/views/school-video/child/player.vue'),
      meta: {
        title: '金千枝商学院',
        icon: '',
      },
      children: [

      ]
    }
  ]
}

export default router;