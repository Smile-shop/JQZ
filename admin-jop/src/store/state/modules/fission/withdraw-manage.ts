const baseUrl = '/fission/withdraw-manage';

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
      appName: '提现列表',
      appCode: 'withdrawList',
      canAccess: false,
      path: `${baseUrl}/withdrawList`,
      appHidden: true,
      children: [
        {
          appName: '提现列表',
          appCode: '',
          canAccess: true,
          path: `${baseUrl}/withdrawList/withdrawListMain`,
        },
        {
          appName: '提现申请',
          appCode: '',
          canAccess: true,
          path: `${baseUrl}/withdrawList/withdrawApply`,
        },
      ]
    },
  ]
}

export default menu;
