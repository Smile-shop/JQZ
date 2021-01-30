const baseUrl = '/prestore/withdraw-manage';

const menu = {
  appName: '资金管理',
  appCode: 'moneyManage',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-jinqian-fanli',
  children: [
    {
      appName: '资金明细',
      appCode: 'moneyDetail',
      canAccess: false,
      path: `${baseUrl}/moneyDetail`,
    },
    {
      appName: '财务对账',
      appCode: 'withdrawList',
      canAccess: false,
      path: `${baseUrl}/withdrawList`,
      appHidden: true,
      children: [
        {
          appName: '财务对账',
          appCode: '',
          canAccess: true,
          path: `${baseUrl}/withdrawList/withdrawListMain`,
        },
      ]
    },
  ]
}

export default menu;
