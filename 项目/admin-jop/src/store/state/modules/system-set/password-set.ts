const baseUrl = '/system-set/password-set'

const menu = {
  appName: '修改密码',
  appCode: '',
  canAccess: true,
  path: baseUrl,
  icon: 'icon-mima1',
  children: [
    {
      appName: '修改密码',
      appCode: '',
      canAccess: true,
      path: `${baseUrl}/password-update`,
      children: [
        {
          appName: '修改管理员密码',
          appCode: '',
          canAccess: true,
          path: `${baseUrl}/password-update/admin-password`,
          children: [
          ]
        },
      ]
    }
  ]
}

export default menu;