const wxCredentialBaseUrl = '/super-crm/wx-credential'

const pointMallMenu = {
  appName: '微证书',
  appCode: 'productCheck',
  canAccess: false,
  path: wxCredentialBaseUrl,
  icon: 'icon-zhengshu',
  children: [
    {
      appName: '微证书设置',
      appCode: 'credentialSet',
      canAccess: false,
      children: [
        {
          appName: '微证书参数',
          appCode: 'credentialParamSet',
          canAccess: false,
          path: `${wxCredentialBaseUrl}/credential-parameter`,
          children: []
        },
        {
          appName: '显示参数',
          appCode: 'credentialShowSet',
          canAccess: false,
          path: `${wxCredentialBaseUrl}/parameter-show`,
          children: []
        },
        {
          appName: '单页展示',
          appCode: 'Page_display',
          canAccess: false,
          path: `${wxCredentialBaseUrl}/page-show`,
          children: []
        },
        {
          appName: '模板展示',
          appCode: 'Template_display',
          canAccess: false,
          path: `${wxCredentialBaseUrl}/module-show`,
          children: []
        },
      ]
    }
  ]
}

export default pointMallMenu;