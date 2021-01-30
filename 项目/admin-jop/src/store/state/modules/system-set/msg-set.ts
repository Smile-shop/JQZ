const baseUrl = '/system-set/msg-set'

const menu = {
  appName: '验证短信',
  appCode: 'prizeSet',
  canAccess: true,
  path: baseUrl,
  icon: 'icon-duanxin',
  children: [
    {
      appName: '验证短信',
      appCode: 'psManage',
      canAccess: true,
      path: `${baseUrl}/msg-validate`,
      children: [
        {
          appName: '短信账户设置',
          appCode: 'psPrizeInfo',
          canAccess: true,
          path: `${baseUrl}/msg-validate/msg-account-set`,
          children: [
          ]
        },
      ]
    }
  ]
}

export default menu;