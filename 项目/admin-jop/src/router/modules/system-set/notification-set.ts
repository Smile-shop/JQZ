export default {
  path: 'notification-set',
  component: () => import('@/views/system-set/notification-set/index.vue'),
  meta: {
  },
  children: [
    // 消息设置
    {
      path: 'message-notification',
      component: () => import('@/views/system-set/notification-set/message-notification/index.vue'),
      redirect: '/system-set/notification-set/message-notification/message-notification-set',
      meta: {
        title: '通知设置',
        icon: 'icon-xiaoxitongzhi',
      },
      children: [
        {
          path: 'message-notification-set',
          component: () => import('@/views/system-set/notification-set/message-notification/index.vue'),
          meta: {
            title: '消息通知',
            icon: 'icon-xiaoxitongzhi',
          },
          children: [
          ]
        }
      ]
    },
  ]
}