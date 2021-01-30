const cloudShowroomBaseUrl = '/cloud-showroom/cloud-showroom'

const cloudShowroomMenu = {
  appName: '云展厅',
  appCode: 'cloudShowroom',
  canAccess: false,
  path: cloudShowroomBaseUrl,
  icon: 'icon-baodan',
  children: [
    {
      appName: '云展厅设置',
      appCode: 'crsCloudRoomSet',
      canAccess: false,
      children: [
        {
          appName: '页面设置',
          appCode: 'csrPageSettings',
          canAccess: false,
          path: `${cloudShowroomBaseUrl}/page-settings`,
          children: []
        },
        {
          appName: '热门分类管理',
          appCode: 'csrOnlinClassify',
          canAccess: false,
          path: `${cloudShowroomBaseUrl}/online-classify`,
          children: []
        },
        {
          appName: '推荐位管理',
          appCode: 'csrRecommend',
          canAccess: false,
          path: `${cloudShowroomBaseUrl}/recommend`,
          children: [
            {
              appName: '轮播图',
              appCode: 'csrRecommend',
              canAccess: true,
              path: `${cloudShowroomBaseUrl}/recommend/carousel`,
            },
            {
              appName: '分类推荐',
              appCode: 'csrRecommend',
              canAccess: true,
              path: `${cloudShowroomBaseUrl}/recommend/type`,
            },
            {
              appName: '商品推荐一',
              appCode: 'csrRecommend',
              canAccess: true,
              path: `${cloudShowroomBaseUrl}/recommend/list-1`,
            },
            {
              appName: '商品推荐二',
              appCode: 'csrRecommend',
              canAccess: true,
              path: `${cloudShowroomBaseUrl}/recommend/list-2`,
            },
          ]
        },
        {
          appName: '分类搜索管理',
          appCode: 'csrClassifySearch',
          canAccess: false,
          path: `${cloudShowroomBaseUrl}/classify-search`,
          children: []
        },
        {
          appName: '筛选管理',
          appCode: 'csrScreenSearch',
          canAccess: false,
          path: `${cloudShowroomBaseUrl}/screen-search`,
          children: []
        },
        {
          appName: '上架管理',
          appCode: 'csrShelves',
          canAccess: false,
          path: `${cloudShowroomBaseUrl}/shelves`,
          children: []
        },
        {
          appName: '客户管理',
          appCode: 'csrClientele',
          canAccess: false,
          path: `${cloudShowroomBaseUrl}/clientele`,
          children: []
        },
        {
          appName: '订单记录',
          appCode: 'csrOrderRecord',
          canAccess: true,
          path: `${cloudShowroomBaseUrl}/order-record`,
          children: [
            {
              appName: '订单记录',
              appCode: 'csrOrderRecord',
              canAccess: true,
              path: `${cloudShowroomBaseUrl}/order-record/index`,
            },
            {
              appName: '订单记录',
              appCode: 'csrOrderRecord',
              canAccess: true,
              path: `${cloudShowroomBaseUrl}/order-record/order-detail`,
            }
          ]
        },
        {
          appName: '小程序绑定',
          appCode: 'csrAppletsBind',
          canAccess: false,
          path: `${cloudShowroomBaseUrl}/wx-auth`,
          children: [],
        }
      ]
    }
  ]
}


export default cloudShowroomMenu
