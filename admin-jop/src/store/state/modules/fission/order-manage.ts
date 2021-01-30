const baseUrl = '/fission/order-manage';

const menu = {
  appName: '订单管理',
  appCode: 'orderManage',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-dingdanguanli',
  children: [
    {
      appName: '订单列表',
      appCode: 'fissionorderList',
      canAccess: false,
      path: `${baseUrl}/orderList`,
    },
    {
      appName: '核销员管理',
      appCode: 'verifierManage',
      canAccess: false,
      path: `${baseUrl}/writeOffList`,
    },
  ]
}

export default menu;
