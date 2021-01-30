const wxQualityPolicyBaseUrl = `/super-crm/wx-quality-policy`;

const wxMemberModuleMenu = {
  appName: '微保单',
  appCode: 'eleWarranty',
  canAccess: false,
  path: wxQualityPolicyBaseUrl,
  icon: 'icon-baodan',
  children: [
    {
      appName: '微保单设置',
      appCode: 'eleWarrantySet',
      canAccess: false,
      path: `${wxQualityPolicyBaseUrl}/quality-policy-set`,
      children: [
        {
          appName: '基础设置',
          appCode: 'warrantySheet',
          canAccess: false,
          path: `${wxQualityPolicyBaseUrl}/quality-policy-set/basis-set`,
          children: []
        },
        {
          appName: '模板展示',
          appCode: 'templateDisplay',
          canAccess: false,
          path: `${wxQualityPolicyBaseUrl}/quality-policy-set/template-show`,
          children: []
        }
      ]
    }
  ]
}

export default wxMemberModuleMenu;