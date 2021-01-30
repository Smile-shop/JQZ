const wxChatRouter = {
  path: 'wx-chat',
  component: () => import('@/views/super-crm/wx-chat/index.vue'),
  redirect: '/super-crm/wx-chat/chat-set',
  meta: {
    isIgnore: true
  },
  children: [
    // 微客服设置
    {
      path: 'chat-set',
      component: () => import('@/views/super-crm/wx-chat/chat-set/index.vue'),
      redirect: '/super-crm/wx-chat/chat-set/servicer-set',
      children: [
        {
          path: 'servicer-set',
          component: () => import('@/views/super-crm/wx-chat/chat-set/pages/ServicerSetting.vue'),
          meta: {
            title: '客服设置',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'servicer-manage',
          component: () => import('@/views/super-crm/wx-chat/chat-set/pages/ServicerManage.vue'),
          meta: {
            title: '客服管理',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'session-history',
          component: () => import('@/views/super-crm/wx-chat/chat-set/pages/SessionHistory.vue'),
          meta: {
            title: '会话记录',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'servicer-report',
          component: () => import('@/views/super-crm/wx-chat/chat-set/pages/ServicerReport.vue'),
          meta: {
            title: '客服报表',
            icon: 'icon-iconfuxing_lipin',
          },
        }
      ]
    }
  ]
}


export default wxChatRouter;
