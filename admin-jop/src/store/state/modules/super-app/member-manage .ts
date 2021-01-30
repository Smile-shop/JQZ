const baseUrl = '/super-app/member-manage';

const menu = {
  appName: '微销宝',
  appCode: 'memberManagement',
  canAccess: false,
  path: baseUrl,
  icon: 'icon-huiyuan2',
  children: [
    {
      appName: '微销宝设置',
      appCode: 'memmMemberManagement',
      canAccess: false,
      path: `${baseUrl}/membership-manage`,
      children: [
        {
          appName: '消息提醒类型设置',
          appCode: 'memmMessageRemindType',
          canAccess: false,
          path: `${baseUrl}/membership-manage/message-reminder`,
        },
        {
          appName: '操作功能设置',
          appCode: 'memmMemberOperatSet',
          canAccess: false,
          path: `${baseUrl}/membership-manage/operation`,
        },
        {
          appName: '会员标签管理',
          appCode: 'memmMemberTagManagement',
          canAccess: false,
          path: `${baseUrl}/membership-manage/member-tag`,
        },
        {
          appName: '粉丝列表设置',
          appCode: 'memmFansListSet',
          canAccess: false,
          path: `${baseUrl}/membership-manage/fans-list`,
        },
        {
          appName: '快捷信息设置',
          appCode: 'memmFastInfoSet',
          canAccess: false,
          path: `${baseUrl}/membership-manage/quick-information`,
        },
      ]
    },
  ]
}

export default menu;