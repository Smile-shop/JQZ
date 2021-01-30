export default {
  path: 'msg-set',
  component: () => import('@/views/system-set/msg-set/index.vue'),
  meta: {
  },
  children: [
    // 验证短信
    {
      path: 'msg-validate',
      component: () => import('@/views/system-set/msg-set/msg-validate/index.vue'),
      redirect: '/system-set/msg-set/msg-validate/msg-account-set',
      meta: {
        title: '验证短信',
        icon: 'icon-duanxin',
      },
      children: [
        {
          path: 'msg-account-set',
          component: () => import('@/views/system-set/msg-set/msg-validate/index.vue'),
          meta: {
            title: '短信账户设置',
            icon: 'icon-duanxin',
          },
          children: [
          ]
        }
      ]
    },
  ]
}