const wxMemberRouter = {
  path: 'wx-member',
  component: () => import('@/views/super-crm/wx-member/index.vue'),
  redirect: '/super-crm/wx-member/member-set',
  meta: {
    isIgnore: true
  },
  children: [
    // 微会员设置
    {
      path: 'member-set',
      component: () => import('@/views/super-crm/wx-member/member-set/index.vue'),
      redirect: '/super-crm/wx-member/member-set/basis-set',
      children: [
        {
          path: 'basis-set',
          component: () => import('@/views/super-crm/wx-member/member-set/pages/BasisSetting.vue'),
          meta: {
            title: '基础设置',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'item-set',
          component: () => import('@/views/super-crm/wx-member/member-set/pages/ItemSetting.vue'),
          meta: {
            title: '注册登录',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'score-set',
          component: () => import('@/views/super-crm/wx-member/member-set/pages/ScoreSetting.vue'),
          meta: {
            title: '积分设置',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'page-style',
          component: () => import('@/views/super-crm/wx-member/member-set/pages/PageStyle.vue'),
          meta: {
            title: '界面设置',
            icon: 'icon-iconfuxing_lipin',
          },
        }
      ]
    },
    // 会员功能
    {
      path: 'member-function',
      component: () => import('@/views/super-crm/wx-member/member-function/index.vue'),
      redirect: '/super-crm/wx-member/member-function/appoint-online',
      children: [
        {
          path: 'appoint-online',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/AppointOnline.vue'),
          meta: {
            title: '在线预约',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'gold-price',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/GoldPrice.vue'),
          meta: {
            title: '今日金价',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'customer-evaluation',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/CustomerEvaluation.vue'),
          meta: {
            title: '客户评价',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'info-center',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/InfoCenter.vue'),
          meta: {
            title: '资讯中心',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'qr-code',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/QrCode.vue'),
          meta: {
            title: '二维码推广',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'member-package',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/wx-package/index.vue'),
          redirect: '/super-crm/wx-member/member-function/member-package/set',
          meta: {
            title: '会员卡包',
            icon: 'icon-iconfuxing_lipin',
          },
          children: [
            {
              path: 'set',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/wx-package/components/PackageSetting.vue'),
              meta: {
                title: '会员卡包',
                icon: 'icon-iconfuxing_lipin',
              },
            },
            {
              path: 'add',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/wx-package/components/AddPackage.vue'),
              meta: {
                title: '会员卡包',
                icon: 'icon-iconfuxing_lipin',
              },
            },
            {
              path: 'record',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/wx-package/components/PackageRecord.vue'),
              meta: {
                title: '会员卡包',
                icon: 'icon-iconfuxing_lipin',
              },
            },
          ]
        },
        {
          path: 'sign-every',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/SignEveryday.vue'),
          meta: {
            title: '每日签到',
            icon: 'icon-iconfuxing_lipin',
          },
        }
      ]
    },
    // 数据统计
    {
      path: 'data-statistics',
      component: () => import('@/views/super-crm/wx-member/data-statistics/index.vue'),
      redirect: '/super-crm/wx-member/data-statistics/member-register',
      children: [
        {
          path: 'member-register',
          component: () => import('@/views/super-crm/wx-member/data-statistics/pages/member-register/index.vue'),
          redirect: '/super-crm/wx-member/data-statistics/member-register/home',
          meta: {
            title: '微会员注册统计',
            icon: 'icon-iconfuxing_lipin',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/member-register/components/Home.vue'),
              meta: {
                title: '微会员注册统计',
                icon: 'icon-iconfuxing_lipin',
              },
            },
            {
              path: 'detail',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/member-register/components/Detail.vue'),
              meta: {
                title: '微会员注册统计',
                icon: 'icon-iconfuxing_lipin',
              },
            },
          ]
        },
        {
          path: 'shop-focus',
          component: () => import('@/views/super-crm/wx-member/data-statistics/pages/shop-focus/index.vue'),
          redirect: '/super-crm/wx-member/data-statistics/shop-focus/total',
          meta: {
            title: '门店关注统计',
            icon: 'icon-iconfuxing_lipin',
          },
          children: [
            {
              path: 'total',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/shop-focus/components/Total.vue'),
              meta: {
                title: '门店关注统计',
                icon: 'icon-iconfuxing_lipin',
              },
            },
            {
              path: 'detail',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/shop-focus/components/Detail.vue'),
              meta: {
                title: '门店关注统计',
                icon: 'icon-iconfuxing_lipin',
              },
            },
          ]
        },
        {
          path: 'saleman-focus',
          component: () => import('@/views/super-crm/wx-member/data-statistics/pages/SalemanFocus.vue'),
          meta: {
            title: '营业员关注统计',
            icon: 'icon-iconfuxing_lipin',
          },
        },
        {
          path: 'function-focus',
          component: () => import('@/views/super-crm/wx-member/data-statistics/pages/function-focus/index.vue'),
          redirect: '/super-crm/wx-member/data-statistics/function-focus/home',
          meta: {
            title: '功能访问统计',
            icon: 'icon-iconfuxing_lipin',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/function-focus/components/Home.vue'),
              meta: {
                title: '功能访问统计',
                icon: 'icon-iconfuxing_lipin',
              },
            },
            {
              path: 'item',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/function-focus/components/Item.vue'),
              meta: {
                title: '功能访问统计',
                icon: 'icon-iconfuxing_lipin',
              },
            },
          ]
        },
        {
          path: 'member-activity',
          component: () => import('@/views/super-crm/wx-member/data-statistics/pages/MemberActivity.vue'),
          meta: {
            title: '会员活跃度统计',
            icon: 'icon-iconfuxing_lipin',
          },
        }
      ]
    }
  ]
}


export default wxMemberRouter;
