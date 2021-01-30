const wxQualityPolicy = {
  path: 'wx-quality-policy',
  component: () => import('@/views/super-crm/wx-quality-policy/index.vue'),
  meta: {
  },
  children: [
    // 微保单设置
    {
      path: 'quality-policy-set',
      component: () => import('@/views/super-crm/wx-quality-policy/quality-policy-set/index.vue'),
      redirect: '/super-crm/wx-quality-policy/quality-policy-set/basis-set',
      children: [
        {
          path: 'basis-set',
          component: () => import('@/views/super-crm/wx-quality-policy/quality-policy-set/pages/BasisSetting.vue'),
          meta: {
            title: '基础设置',
            icon: 'icon-baodan',
          },
        },
        {
          path: 'template-show',
          component: () => import('@/views/super-crm/wx-quality-policy/quality-policy-set/pages/TemplateShow.vue'),
          meta: {
            title: '模板展示',
            icon: 'icon-baodan',
          },
        }
      ]
    }
  ]
}


export default wxQualityPolicy;
