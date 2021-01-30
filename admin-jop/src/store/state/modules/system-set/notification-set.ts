const baseUrl = '/system-set/notification-set'

const menu = {
  appName: '通知设置',
  canAccess: true,
  path: baseUrl,
  icon: 'icon-xiaoxitongzhi',
  children: [
    {
      appName: '通知设置',
      canAccess: true,
      path: `${baseUrl}/message-notification`,
      children: [
        {
          appName: '消息通知',
          canAccess: true,
          path: `${baseUrl}/message-notification/message-notification-set`,
          children: [
          ]
        },
      ]
    }
  ]
}

export default menu;