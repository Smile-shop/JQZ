const baseUrl = '/super-mkt/market-promotion'

const menu = {
  appName: '营销推广',
  appCode: 'marketPromotion',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-iconfuxing_lipin',
  children: [
    {
      appName: '推广设置',
      appCode: 'mpPromotionSet',
      canAccess: false,
      path: `${baseUrl}/promotion-set`,
      children: [
        {
          appName: '设置方案',
          appCode: 'mpSetPlan',
          canAccess: false,
          path: `${baseUrl}/promotion-set/set-plan`,
          children: [
            {
              appName: '设置方案',
              canAccess: true,
              path: `${baseUrl}/promotion-set/set-plan/home`,
            },
            {
              appName: '设置方案',
              canAccess: true,
              path: `${baseUrl}/promotion-set/set-plan/edit`,
            },
          ]
        },
      ]
    }
  ]
}

export default menu;