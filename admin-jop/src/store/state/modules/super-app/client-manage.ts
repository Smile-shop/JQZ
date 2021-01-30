const baseUrl = '/super-app/client-manage';

const menu = {
  appName: '客资管理系统',
  appCode: 'customManage',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-keziguanli',
  children: [
    {
      appName: '数据统计',
      appCode: 'cmDataCount',
      canAccess: false,
      path: `${baseUrl}/data-count`,
      children: [
        {
          appName: '线索池统计',
          appCode: 'cmPoolCount',
          canAccess: false,
          path: `${baseUrl}/data-count/pool-count`,
        },
        {
          appName: '潜在客统计',
          appCode: 'cmCustomClueCount',
          canAccess: false,
          path: `${baseUrl}/data-count/custom-clue-count`,
        },
        {
          appName: '目标客统计',
          appCode: 'cmCustomCount',
          canAccess: false,
          path: `${baseUrl}/data-count/custom-count`,
        },
        {
          appName: '客户池统计',
          appCode: 'cmCustomGSCount',
          canAccess: false,
          path: `${baseUrl}/data-count/custom-gs-Count`,
        },
      ]
    },
    {
      appName: '客资管理系统设置',
      appCode: 'cmSystemSet',
      canAccess: false,
      path: `${baseUrl}/system-set`,
      children: [
        {
          appName: '基础资料维护',
          appCode: 'cmBaseInfoManage',
          canAccess: false,
          path: `${baseUrl}/system-set/base-info-manage`,
        },
      ]
    },
  ]
}

export default menu;