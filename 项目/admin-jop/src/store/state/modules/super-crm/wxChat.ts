const wxChatBaseUrl = `/super-crm/wx-chat`;

const wxChatModuleMenu = {
  appName: '微客服',
  appCode: 'cloudCService',
  canAccess: false,
  path: wxChatBaseUrl,
  icon: 'icon-kefu',
  children: [
    {
      appName: '微客服设置',
      appCode: 'ccService',
      canAccess: false,
      path: `${wxChatBaseUrl}/chat-set`,
      children: [
        {
          appName: '客服设置',
          appCode: 'ccSSet',
          canAccess: false,
          path: `${wxChatBaseUrl}/chat-set/servicer-set`,
          children: []
        },
        {
          appName: '客服管理',
          appCode: 'ccSManager',
          canAccess: false,
          path: `${wxChatBaseUrl}/chat-set/servicer-manage`,
          children: []
        },
        {
          appName: '会话记录',
          appCode: 'ccChatLog',
          canAccess: false,
          path: `${wxChatBaseUrl}/chat-set/session-history`,
          children: []
        },
        {
          appName: '客服报表',
          appCode: 'ccReport',
          canAccess: false,
          path: `${wxChatBaseUrl}/chat-set/servicer-report`,
          children: []
        }
      ]
    }
  ]
}

export default wxChatModuleMenu;