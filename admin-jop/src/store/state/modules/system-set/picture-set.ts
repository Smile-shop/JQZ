const baseUrl = '/system-set/picture-set'

const menu = {
  appName: '图片访问',
  appCode: 'pictureSet',
  canAccess: true,
  path: baseUrl,
  icon: 'icon-tupian',
  children: [
    {
      appName: '图片访问',
      appCode: 'pictureGet',
      canAccess: true,
      path: `${baseUrl}/picture-get`,
      children: [
        {
          appName: '图片访问设置',
          appCode: 'pictureGetUpdate',
          canAccess: true,
          path: `${baseUrl}/picture-get/picture-get-update`,
          children: [
          ]
        },
      ]
    }
  ]
}

export default menu;