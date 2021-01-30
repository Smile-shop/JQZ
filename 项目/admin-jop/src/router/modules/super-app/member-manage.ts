const router = {
  path: 'member-manage',
  component: () => import('@/views/super-app/member-manage/index.vue'),
  meta: {
  },
  children: [
    // 会员管理设置
    {
      path: 'membership-manage',
      component: () => import('@/views/super-app/member-manage/index.vue'),
      meta: {
        title: '微销宝设置',
        icon: 'icon-price',
      },
      redirect: '/super-app/member-manage/membership-manage',
      children: [
        {
          path: 'message-reminder',
          component: () => import('@/views/super-app/member-manage/membership-manage/pages/messageReminder.vue'),
          meta: {
            title: '消息提醒类型设置',
            icon: 'icon-message',
          },
        },
        {
          path: 'operation',
          component: () => import('@/views/super-app/member-manage/membership-manage/pages/operation.vue'),
          meta: {
            title: '操作功能设置',
            icon: 'icon-gongnengshezhi',
          },
        },
        {
          path: 'member-tag',
          component: () => import('@/views/super-app/member-manage/membership-manage/pages/memberTag.vue'),
          meta: {
            title: '会员标签管理',
            icon: 'icon-huiyuanbiaoqian',
          },
        },
        {
          path: 'fans-list',
          component: () => import('@/views/super-app/member-manage/membership-manage/pages/fansList.vue'),
          meta: {
            title: '粉丝列表设置',
            icon: 'icon-fensi',
          },
        },
        {
          path: 'quick-information',
          component: () => import('@/views/super-app/member-manage/membership-manage/pages/quickInformation.vue'),
          meta: {
            title: '快捷信息设置',
            icon: 'icon-xiaoxizhongxin',
          },
        }
      ]
    },
  ]
}

export default router;