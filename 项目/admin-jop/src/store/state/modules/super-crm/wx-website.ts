const baseUrl = '/super-crm/wx-website'

const menu = {
  appName: '微官网',
  appCode: 'wxOrder',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-weiguanwang',
  children: [
    {
      appName: '微官网设置',
      appCode: 'wxOfficWeb',
      canAccess: false,
      children: [
        {
          appName: '企业资料',
          appCode: 'wxWebData',
          canAccess: false,
          path: `${baseUrl}/company-data`,
        },
        {
          appName: '栏目管理',
          appCode: 'wxWebColumn',
          canAccess: false,
          path: `${baseUrl}/program-manage`,
        },
        {
          appName: '界面风格',
          appCode: 'wxWebStyle',
          canAccess: false,
          path: `${baseUrl}/page-style`,
        },
        {
          appName: '文章管理',
          appCode: 'wxWebArticle',
          canAccess: false,
          path: `${baseUrl}/article-manage`,
        },
        {
          appName: '留言反馈',
          appCode: 'wxWebMessage',
          canAccess: false,
          path: `${baseUrl}/new-message`,
        },
      ]
    }
  ]
}

export default menu;