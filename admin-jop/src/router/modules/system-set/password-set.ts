export default {
  path: 'password-set',
  component: () => import('@/views/system-set/password-set/index.vue'),
  meta: {
  },
  children: [
    {
      path: 'password-update',
      component: () => import('@/views/system-set/password-set/password-update/index.vue'),
      redirect: '/system-set/password-set/password-update/admin-password',
      meta: {
        title: '修改密码',
        icon: 'icon-mima1',
      },
      children: [
        {
          path: 'admin-password',
          component: () => import('@/views/system-set/password-set/password-update/AdminPassword.vue'),
          meta: {
            title: '修改管理员密码',
            icon: 'icon-mima1',
          },
          children: [
          ]
        }
      ]
    },
  ]
}