const baseUrl = '/fission/setting';

const menu = {
  appName: '设置', // 分销设置
  appCode: 'distriSet',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-shezhi1',
  children: [
    {
      appName: '商家设置',
      appCode: 'merchantSet',
      canAccess: false,
      path: `${baseUrl}/merchantSettings`,
    },
    {
      appName: '客服设置',
      appCode: 'customerSet',
      canAccess: false,
      path: `${baseUrl}/customerSettings`,
    },
  ]
}

export default menu;
