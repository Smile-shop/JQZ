const systemSetting = {
  path: 'system-set',
  component: () => import('@/views/super-crm/system-setting/index.vue'),
  redirect: '/super-crm/system-set/wx-set',
  meta: {
    isIgnore: true
  },
  children: [
    // 公众号设置
    {
      path: 'wx-set',
      component: () => import('@/views/super-crm/system-setting/wx-setting/index.vue'),
      redirect: '/super-crm/system-set/wx-set/wx-bind',
      children: [
        {
          path: 'wx-bind',
          component: () => import('@/views/super-crm/system-setting/wx-setting/pages/WxBind.vue'),
          meta: {
            title: '公众号绑定',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'menu-set',
          component: () => import('@/views/super-crm/system-setting/wx-setting/pages/MenuSetting.vue'),
          meta: {
            title: '自定义菜单',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'auto-replay',
          component: () => import('@/views/super-crm/system-setting/wx-setting/pages/AutoReply.vue'),
          meta: {
            title: '自动回复',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'msg-set',
          component: () => import('@/views/super-crm/system-setting/wx-setting/pages/MessageSetting.vue'),
          meta: {
            title: '微信消息',
            icon: 'icon-iconfuxing_lipin',
          },
        }
      ]
    }
  ]
}


export default systemSetting;
