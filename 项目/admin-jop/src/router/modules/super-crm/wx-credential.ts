const wxCredential = {
  path: 'wx-credential',
  component: () => import('@/views/super-crm/wx-credential/index.vue'),
  meta: {
  },
  children: [
    // 微证书设置
    {
      path: 'credential-parameter',
      component: () => import('@/views/super-crm/wx-credential/credential-parameter/index.vue'),
      meta: {
        title: '微证书设置',
        icon: 'icon-zhengshu',
      },
    },
    // 显示参数
    {
      path: 'parameter-show',
      component: () => import('@/views/super-crm/wx-credential/parameter-show/index.vue'),
      meta: {
        title: '参数设置',
        icon: 'icon-zhengshu',
      },
    },
    // 单页展示
    {
      path: 'page-show',
      component: () => import('@/views/super-crm/wx-credential/page-show/index.vue'),
      meta: {
        title: '单页展示',
        icon: 'icon-zhengshu',
      },
    },
    // 模板展示
    {
      path: 'module-show',
      component: () => import('@/views/super-crm/wx-credential/module-show/index.vue'),
      meta: {
        title: '模板展示',
        icon: 'icon-zhengshu',
      },
    },
  ]
}

export default wxCredential;