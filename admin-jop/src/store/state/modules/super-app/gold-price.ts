const baseUrl = '/super-app/gold-price';

const menu = {
  appName: '今日金价',
  appCode: 'dayPrice',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-price',
  children: [
    {
      appName: '今日金价设置',
      appCode: 'dpGoldPrice',
      canAccess: false,
      children: [
        {
          appName: '界面风格',
          appCode: 'dpInterfaceStyle',
          canAccess: false,
          path: `${baseUrl}/page-style`,
        },
      ]
    }
  ]
}

export default menu;