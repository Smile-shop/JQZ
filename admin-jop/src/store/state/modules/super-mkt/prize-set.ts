const baseUrl = '/super-mkt/prize-set'

const menu = {
  appName: '奖品设置',
  appCode: 'prizeSet',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-iconfuxing_lipin',
  children: [
    {
      appName: '奖品管理',
      appCode: 'psManage',
      canAccess: false,
      path: `${baseUrl}/prize-manage`,
      children: [
        {
          appName: '奖品信息',
          appCode: 'psPrizeInfo',
          canAccess: false,
          path: `${baseUrl}/prize-manage/prize-info`,
          children: [
            {
              appName: '奖品信息',
              appCode: 'psPrizeInfo',
              canAccess: true,
              path: `${baseUrl}/prize-manage/prize-info/home`,
            },
            {
              appName: '奖品信息',
              appCode: 'psPrizeInfo',
              canAccess: true,
              path: `${baseUrl}/prize-manage/prize-info/edit`,
            },
          ]
        },
      ]
    }
  ]
}

export default menu;