export default {
  path: 'user-set',
  component: () => import('@/views/system-set/user-set/index.vue'),
  meta: {
    title: '用户维护',
    icon: 'icon-zhanghu1',
  },
  children: [
    {
      path: 'user-control',
      component: () => import('@/views/system-set/user-set/user/index.vue'),
      redirect: '/system-set/user-set/user-control/position-manage',
      meta: {
        title: '用户维护',
        icon: 'icon-zhanghu1',
      },
      children: [
        {
          path: 'position-manage',
          component: () => import('@/views/system-set/user-set/user/PositionManage.vue'),
          meta: {
            title: '职位管理',
            icon: 'icon-zhanghu1',
          },
          children: [
          ]
        },
        {
          path: 'account-manage',
          component: () => import('@/views/system-set/user-set/user/AccountManage.vue'),
          meta: {
            title: '',
            icon: '',
          },
          children: [
          ]
        },
        {
          path: 'permission-tem-manage',
          component: () => import('@/views/system-set/user-set/user/permissionTemManage.vue'),
          meta: {
            title: '权限模板管理',
            icon: 'icon-zhanghu1',
            hiddenBack: true
          },
          children: [
          ]
        }
      ]
    },
  ]
}