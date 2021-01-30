const wxChatBaseUrl = `/super-crm/system-set`;

const systemSetting = {
  appName: '参数设置',
  appCode: 'paramSet',
  canAccess: false,
  path: wxChatBaseUrl,
  icon: 'icon-xitong',
  children: [
    {
      appName: '公众号设置',
      appCode: 'psPublicNoSet',
      canAccess: false,
      path: `${wxChatBaseUrl}/wx-set`,
      children: [
        {
          appName: '公众号绑定',
          appCode: 'psPublicBind',
          canAccess: false,
          path: `${wxChatBaseUrl}/wx-set/wx-bind`,
          children: []
        },
        {
          appName: '自定义菜单',
          appCode: 'psCustomMenu',
          canAccess: false,
          path: `${wxChatBaseUrl}/wx-set/menu-set`,
          children: []
        },
        {
          appName: '自动回复设置',
          appCode: 'psAutoResponseSet',
          canAccess: false,
          path: `${wxChatBaseUrl}/wx-set/auto-replay`,
          children: []
        },
        {
          appName: '微信消息设置',
          appCode: 'psWxMsgSet',
          canAccess: false,
          path: `${wxChatBaseUrl}/wx-set/msg-set`,
          children: []
        },
      ]
    }
  ]
}

export default systemSetting;