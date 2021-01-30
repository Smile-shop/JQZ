const baseUrl = '/prestore/order-manage';

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
      appName: '礼品列表',
      appCode: 'fissionorderList',
      canAccess: false,
      path: `${baseUrl}/giftList`,
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
