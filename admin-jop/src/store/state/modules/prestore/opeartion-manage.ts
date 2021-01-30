const baseUrl = '/prestore/opeartion-manage';

const menu = {
  appName: '运营管理',
  appCode: 'operationManage',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-yunying',
  children: [
    // 活动数据暂不开发
    // {
    //   appName: '活动数据',
    //   appCode: 'prestoreactivityData',
    //   canAccess: false,
    //   path: `${baseUrl}/activity-list`,
    // },
    {
      appName: '活动反馈',
      appCode: 'activityFeedback',
      canAccess: false,
      path: `${baseUrl}/activityFeedback`,
    },
  ]
}

export default menu;
