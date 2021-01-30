/**
 * @description 自定义菜单, 用于不受权限控制但需要在菜单栏显示的菜单
 */

export default [
  {
    name: '用户中心',
    visible: 'Y',
    webUrl: '/user',
    featureList: [],
    iconUrl: '',
    node: 'Y',
    subMenuList: [
      {
        name: '用户信息',
        visible: 'Y',
        webUrl: '/user/info',
        featureList: [],
        iconUrl: 'user',
        node: 'N',
      },
      {
        name: '修改密码',
        visible: 'Y',
        webUrl: '/user/reset-password',
        featureList: [],
        iconUrl: 'lock',
        node: 'N',
      },
    ]
  }
];
