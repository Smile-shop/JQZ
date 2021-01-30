const baseUrl = '/fission/distri-manage';

const menu = {
  appName: '分销管理',
  appCode: 'distriManage',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-fenxiaoshang',
  children: [
    {
      appName: '活动列表',
      appCode: 'activityList',
      canAccess: false,
      path: `${baseUrl}/activity-list`,
      appHidden: true,
      children: [
        {
          appName: '活动列表',
          appCode: '',
          canAccess: true,
          path: `${baseUrl}/activity-list/index`,
        },
        {
          appName: '渠道推广',
          appCode: '',
          canAccess: true,
          path: `${baseUrl}/activity-list/channelPopularize`,
        },
        {
          appName: '活动信息',
          appCode: '',
          canAccess: true,
          path: `${baseUrl}/activity-list/add`,
        },
      ]
    },
    {
      appName: '活动用户',
      appCode: 'activityUserList',
      canAccess: false,
      path: `${baseUrl}/activity-user-list`,
    },
  ]
}

export default menu;
