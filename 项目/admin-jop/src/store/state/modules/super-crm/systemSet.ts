const wxSystemSetBaseUrl = `/super-crm/wx-chat`;

const wxChatModuleMenu = {
  appName: '公众号设置',
  appCode: 'cloudCService',
  canAccess: false,
  path: wxSystemSetBaseUrl,
  children: [
    {
      appName: '公众号设置',
      appCode: 'Customer_service',
      canAccess: false,
      path: `${wxSystemSetBaseUrl}/member-set`,
      children: [
        {
          appName: '公众号绑定',
          appCode: 'Activitylevel',
          canAccess: false,
          path: `${wxSystemSetBaseUrl}/data-statistics/member-activity`,
          children: []
        },
        {
          appName: '自定义菜单',
          appCode: 'Activitylevel',
          canAccess: false,
          path: `${wxSystemSetBaseUrl}/data-statistics/member-activity`,
          children: []
        },
        {
          appName: '自动回复设置',
          appCode: 'Activitylevel',
          canAccess: false,
          path: `${wxSystemSetBaseUrl}/data-statistics/member-activity`,
          children: []
        },
        {
          appName: '微信消息设置',
          appCode: 'Activitylevel',
          canAccess: false,
          path: `${wxSystemSetBaseUrl}/data-statistics/member-activity`,
          children: []
        },
        {
          appName: '微信小程序设置',
          appCode: 'Activitylevel',
          canAccess: false,
          path: `${wxSystemSetBaseUrl}/data-statistics/member-activity`,
          children: []
        }
      ]
    }
  ]
}

export default wxChatModuleMenu;