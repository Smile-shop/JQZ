const baseUrl = '/system-set/store-set'

const menu = {
  appName: '门店管理',
  canAccess: true,
  path: baseUrl,
  icon: 'icon-mendian1',
  children: [
    {
      appName: '门店管理',
      canAccess: true,
      path: `${baseUrl}/store-manage`,
      children: [
        {
          appName: '门店设置',
          canAccess: true,
          path: `${baseUrl}/store-manage/store-manage-set`,
          children: [
          ]
        },
      ]
    }
  ]
}

export default menu;