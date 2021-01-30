const wxMallRouter = {
  path: 'wx-website',
  component: () => import('@/views/super-crm/wx-website/index.vue'),
  redirect: '/super-crm/wx-website/company-data',
  meta: {
  },
  children: [
    // 企业资料
    {
      path: 'company-data',
      component: () => import('@/views/super-crm/wx-website/company-data/index.vue'),
      meta: {
        title: '企业资料',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 栏目管理
    {
      path: 'program-manage',
      component: () => import('@/views/super-crm/wx-website/program-manage/index.vue'),
      meta: {
        title: '栏目管理',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 界面风格
    {
      path: 'page-style',
      component: () => import('@/views/super-crm/wx-website/page-style/index.vue'),
      meta: {
        title: '界面风格',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 文章管理
    {
      path: 'article-manage',
      component: () => import('@/views/super-crm/wx-website/article-manage/index.vue'),
      meta: {
        title: '文章管理',
        icon: 'icon-iconfuxing_lipin',
      },
    },
    // 留言反馈
    {
      path: 'new-message',
      component: () => import('@/views/super-crm/wx-website/new-message/index.vue'),
      meta: {
        title: '留言反馈',
        icon: 'icon-iconfuxing_lipin',
      },
    },
  ]
}

export default wxMallRouter;