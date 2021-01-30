const wxMemberBaseUrl = `/super-crm/wx-member`;

const wxMemberModuleMenu = {
  appName: '微会员',
  appCode: 'onlineMember',
  canAccess: false,
  path: wxMemberBaseUrl,
  icon: 'icon-huiyuan',
  children: [
    {
      appName: '微会员设置',
      appCode: 'set',
      canAccess: false,
      path: `${wxMemberBaseUrl}/member-set`,
      children: [
        {
          appName: '基础设置',
          appCode: 'Basics',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-set/basis-set`,
          children: []
        },
        {
          appName: '注册登录',
          appCode: 'Registerlogin',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-set/item-set`,
          children: []
        },
        {
          appName: '积分设置',
          appCode: 'integral',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-set/score-set`,
          children: []
        },
        {
          appName: '邀请设置',
          appCode: 'inviteSet',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-set/invite-set`,
          children: []
        },
        {
          appName: '界面设置',
          appCode: 'Interface',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-set/page-style`,
          children: []
        },
        {
          appName: '连单券',
          appCode: 'liandanquan',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-set/link-coupon`,
          children: [
            {
              appName: '连单券',
              appCode: '',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-set/link-coupon/list`
            },
            {
              appName: '连单券',
              appCode: '',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-set/link-coupon/addOrEdit`
            },
            {
              appName: '连单券',
              appCode: '',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-set/link-coupon/data`
            },
            {
              appName: '连单券',
              appCode: '',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-set/link-coupon/dataDetail`
            },
          ]
        },
        {
          appName: '优惠券设置',
          appCode: 'couponSet',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-set/coupon-set`,
          children: []
        },
      ]
    },
    {
      appName: '会员功能',
      appCode: 'members',
      canAccess: false,
      path: `${wxMemberBaseUrl}/member-function`,
      children: [
        {
          appName: '在线预约',
          appCode: 'Onlinebooking',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-function/appoint`,
          children: [
            {
              appName: '在线预约',
              appCode: 'Onlinebooking',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-function/appoint/online`,
            },
            {
              appName: '预约记录',
              appCode: 'Onlinebooking',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-function/appoint/record`,
            },
          ]
        },
        {
          appName: '今日金价',
          appCode: 'dpGoldPrice',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-function/gold-price`,
          children: []
        },
        {
          appName: '客户评价',
          appCode: 'evaluate',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-function/customer-evaluation`,
          children: []
        },
        {
          appName: '资讯中心',
          appCode: 'information',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-function/info-center`,
          children: [
            {
              appName: '资讯中心',
              appCode: 'information',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-function/info-center/programe`,
            },
            {
              appName: '资讯中心',
              appCode: 'information',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-function/info-center/infomation`,
            },
            {
              appName: '资讯中心',
              appCode: 'information',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-function/info-center/edit`,
            }
          ]
        },
        {
          appName: '二维码推广',
          appCode: 'QRcode',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-function/qr-code`,
          children: []
        },
        {
          appName: '会员卡包',
          appCode: 'Cardbag',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-function/member-package`,
          children: [
            {
              appName: '会员卡包',
              appCode: 'Cardbag',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-function/member-package/set`,
            },
            {
              appName: '会员卡包',
              appCode: 'Cardbag',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-function/member-package/add`,
            },
            {
              appName: '会员卡包',
              appCode: 'Cardbag',
              canAccess: true,
              path: `${wxMemberBaseUrl}/member-function/member-package/record`,
            }
          ]
        },
        {
          appName: '每日签到',
          appCode: 'Signin',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-function/sign-every`,
          children: []
        },
        {
          appName: '积分记录',
          appCode: 'mbPointRecord',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-function/score-record`,
          children: []
        },
        {
          appName: '附近门店',
          appCode: 'nearShop',
          canAccess: false,
          path: `${wxMemberBaseUrl}/member-function/near-shop`,
          children: []
        },
      ]
    },
    {
      appName: '数据统计',
      appCode: 'pageAccess',
      canAccess: false,
      path: `${wxMemberBaseUrl}/data-statistics`,
      children: [
        {
          appName: '微会员注册统计',
          appCode: 'register',
          canAccess: false,
          path: `${wxMemberBaseUrl}/data-statistics/member-register`,
          children: [
            {
              appName: '微会员注册统计',
              appCode: 'register',
              canAccess: true,
              path: `${wxMemberBaseUrl}/data-statistics/member-register/home`,
            },
            {
              appName: '微会员注册统计',
              appCode: 'register',
              canAccess: true,
              path: `${wxMemberBaseUrl}/data-statistics/member-register/detail`,
            }
          ]
        },
        {
          appName: '门店关注统计',
          appCode: 'StoreConcern',
          canAccess: false,
          path: `${wxMemberBaseUrl}/data-statistics/shop-focus`,
          children: [
            {
              appName: '门店关注统计',
              appCode: 'StoreConcern',
              canAccess: true,
              path: `${wxMemberBaseUrl}/data-statistics/shop-focus/total`,
            },
            {
              appName: '门店关注统计',
              appCode: 'StoreConcern',
              canAccess: true,
              path: `${wxMemberBaseUrl}/data-statistics/shop-focus/detail`,
            }
          ]
        },
        {
          appName: '营业员关注统计',
          appCode: 'SalesClerk',
          canAccess: false,
          path: `${wxMemberBaseUrl}/data-statistics/saleman-focus`,
          children: []
        },
        {
          appName: '功能访问统计',
          appCode: 'Functionalaccess',
          canAccess: false,
          path: `${wxMemberBaseUrl}/data-statistics/function-focus`,
          children: [
            {
              appName: '功能访问统计',
              appCode: 'Functionalaccess',
              canAccess: true,
              path: `${wxMemberBaseUrl}/data-statistics/function-focus/home`,
            },
            {
              appName: '功能访问统计',
              appCode: 'Functionalaccess',
              canAccess: true,
              path: `${wxMemberBaseUrl}/data-statistics/function-focus/item`,
            }
          ]
        },
        {
          appName: '会员活跃度统计',
          appCode: 'Activitylevel',
          canAccess: false,
          path: `${wxMemberBaseUrl}/data-statistics/member-activity`,
          children: []
        },
      ]
    }
  ]
}

export default wxMemberModuleMenu;