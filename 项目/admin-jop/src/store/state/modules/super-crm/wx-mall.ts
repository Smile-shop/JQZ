const baseUrl = '/super-crm/wx-mall'

const menu = {
  appName: '微商城',
  appCode: 'onlineShop',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-shangcheng',
  children: [
    {
      appName: '微商城设置',
      appCode: 'shopSet',
      canAccess: false,
      children: [
        {
          appName: '界面设置',
          appCode: 'wxMallPage',
          canAccess: false,
          path: `${baseUrl}/page-set`,
        },
        {
          appName: '门店设置',
          appCode: 'wxMallStoreSet',
          canAccess: false,
          path: `${baseUrl}/shop-set`,
        },
        {
          appName: '商品详情编辑',
          appCode: 'wxMallProduct',
          canAccess: false,
          path: `${baseUrl}/product-detail`,
        },
        {
          appName: '商品搜索设置',
          appCode: 'wxSellRules',
          canAccess: false,
          path: `${baseUrl}/product-search`,
        },
        {
          appName: '详情参数设置',
          appCode: 'wxMallShowParam',
          canAccess: false,
          path: `${baseUrl}/show-param`,
        },
        {
          appName: '列表参数设置',
          appCode: 'wxMallListParamSet',
          canAccess: false,
          path: `${baseUrl}/list-param`,
        },
        {
          appName: '商品分享设置',
          appCode: 'wxMallProductShareSet',
          canAccess: false,
          path: `${baseUrl}/share`,
        },
        {
          appName: '邮寄方式设置',
          appCode: 'wxMallPostWaySet',
          canAccess: false,
          path: `${baseUrl}/post-method`,
        },
        {
          appName: '公众号引导关注设置',
          appCode: 'wxMallPublicGuideSet',
          canAccess: false,
          path: `${baseUrl}/guide`,
        },
      ]
    },
    {
      appName: '微商城统计',
      appCode: 'wxShopCount',
      canAccess: false,
      children: [
        {
          appName: '导购销售统计',
          appCode: 'wxsGuideSaleCount',
          canAccess: false,
          path: `${baseUrl}/salesman-sales-data`,
          children: [
            {
              appName: '导购销售统计',
              appCode: 'wxsGuideSaleCount',
              canAccess: true,
              path: `${baseUrl}/salesman-sales-data/`,
            },
            {
              appName: '导购销售统计明细',
              appCode: 'wxsGuideSaleCount',
              canAccess: true,
              path: `${baseUrl}/salesman-sales-data/detail`,
            },
          ]
        },
      ]
    },
  ]
}

export default menu;
