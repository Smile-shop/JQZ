const baseUrl = '/system-set/user-set'

const menu = {
  appName: '用户维护',
  appCode: 'userSet',
  canAccess: true,
  path: baseUrl,
  icon: 'icon-zhanghu1',
  children: [
    {
      appName: '用户维护',
      appCode: 'userControl',
      canAccess: true,
      path: `${baseUrl}/user-control`,
      children: [
        {
          appName: '职位管理',
          appCode: 'positionManage',
          canAccess: true,
          path: `${baseUrl}/user-control/position-manage`,
          children: [
          ]
        },
        {
          appName: '账户管理',
          appCode: 'accountManage',
          canAccess: true,
          path: `${baseUrl}/user-control/account-manage`,
          children: [
          ]
        },
        {
          appName: '权限模板管理',
          appCode: 'permissionTemManage',
          canAccess: true,
          path: `${baseUrl}/user-control/permission-tem-manage`,
          children: [
          ]
        },
      ]
    }
  ]
}

export default menu;