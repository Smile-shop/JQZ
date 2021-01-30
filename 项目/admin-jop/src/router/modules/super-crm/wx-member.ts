const wxMemberRouter = {
  path: 'wx-member',
  component: () => import('@/views/super-crm/wx-member/index.vue'),
  meta: {
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
            icon: 'icon-shezhi1',
          },
        },
        {
          path: 'item-set',
          component: () => import('@/views/super-crm/wx-member/member-set/pages/ItemSetting.vue'),
          meta: {
            title: '注册登录',
            icon: 'icon-iconfontedit',
          },
        },
        {
          path: 'score-set',
          component: () => import('@/views/super-crm/wx-member/member-set/pages/ScoreSetting.vue'),
          meta: {
            title: '积分设置',
            icon: 'icon-jifen',
          },
        },
        {
          path: 'invite-set',
          component: () => import('@/views/super-crm/wx-member/member-set/pages/inviteSetting.vue'),
          meta: {
            title: '邀请设置',
            icon: 'icon-iconfontedit',
          },
        },
        {
          path: 'page-style',
          component: () => import('@/views/super-crm/wx-member/member-set/pages/PageStyle.vue'),
          meta: {
            title: '界面设置',
            icon: 'icon-jiemianguanli',
          },
        },
        {
          path: 'link-coupon',
          component: () => import('@/views/super-crm/wx-member/member-set/link-coupon/index.vue'),
          redirect: '/super-crm/wx-member/member-set/link-coupon/list',
          meta: {
            title: '连单券',
            icon: 'icon-jiemianguanli',
          },
          children: [
            {
              path: 'list',
              component: () => import('@/views/super-crm/wx-member/member-set/link-coupon/pages/list.vue'),
              meta: {
                title: '连单券',
                icon: 'icon-jiemianguanli',
              }
            },
            {
              path: 'addOrEdit',
              component: () => import('@/views/super-crm/wx-member/member-set/link-coupon/pages/addOrEdit.vue'),
              meta: {
                title: '连单券',
                icon: 'icon-jiemianguanli',
              },
            },
            {
              path: 'data',
              component: () => import('@/views/super-crm/wx-member/member-set/link-coupon/pages/data.vue'),
              meta: {
                title: '连单券',
                icon: 'icon-jiemianguanli',
              },
            },
            {
              path: 'dataDetail',
              component: () => import('@/views/super-crm/wx-member/member-set/link-coupon/pages/dataDetail.vue'),
              meta: {
                title: '连单券',
                icon: 'icon-jiemianguanli',
              },
            }
          ]
        },
        {
          path: 'coupon-set',
          component: () => import('@/views/super-crm/wx-member/member-set/pages/CouponSetting.vue'),
          meta: {
            title: '优惠券设置',
            icon: 'icon-jiemianguanli',
          },
        }
      ]
    },
    // 会员功能
    {
      path: 'member-function',
      component: () => import('@/views/super-crm/wx-member/member-function/index.vue'),
      redirect: '/super-crm/wx-member/member-function/appoint',
      children: [
        {
          path: 'appoint',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/appoint/Home.vue'),
          redirect: '/super-crm/wx-member/member-function/appoint/online',
          meta: {
            title: '在线预约',
            icon: 'icon-yuyue',
          },
          children: [
            {
              path: 'online',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/appoint/AppointOnline.vue'),
              meta: {
                title: '在线预约',
                icon: 'icon-zixun',
              },
            },
            {
              path: 'record',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/appoint/AppointRecord.vue'),
              meta: {
                title: '预约记录',
                icon: 'icon-zixun',
              },
            },
          ]
        },
        {
          path: 'gold-price',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/GoldPrice.vue'),
          meta: {
            title: '今日金价',
            icon: 'icon-yuyue1',
          },
        },
        {
          path: 'customer-evaluation',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/CustomerEvaluation.vue'),
          meta: {
            title: '客户评价',
            icon: 'icon-pingjia',
          },
        },
        {
          path: 'info-center',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/info-center/index.vue'),
          redirect: '/super-crm/wx-member/member-function/info-center/programe',
          meta: {
            title: '资讯中心',
            icon: 'icon-zixun',
          },
          children: [
            {
              path: 'programe',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/info-center/components/ProgramManage.vue'),
              meta: {
                title: '资讯中心',
                icon: 'icon-zixun',
              },
            },
            {
              path: 'infomation',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/info-center/components/InfomationManage.vue'),
              meta: {
                title: '资讯中心',
                icon: 'icon-zixun',
              },
            },
            {
              path: 'edit',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/info-center/components/InfomationEdit.vue'),
              meta: {
                title: '资讯中心',
                icon: 'icon-zixun',
              },
            },
          ]
        },
        {
          path: 'qr-code',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/QrCode.vue'),
          meta: {
            title: '二维码推广',
            icon: 'icon-ico',
          },
        },
        {
          path: 'member-package',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/wx-package/index.vue'),
          redirect: '/super-crm/wx-member/member-function/member-package/set',
          meta: {
            title: '会员卡包',
            icon: 'icon-huiyuan',
          },
          children: [
            {
              path: 'set',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/wx-package/components/PackageSetting.vue'),
              meta: {
                title: '会员卡包',
                icon: 'icon-membership-card_icon',
              },
            },
            {
              path: 'add',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/wx-package/components/AddPackage.vue'),
              meta: {
                title: '会员卡包',
                icon: 'icon-membership-card_icon',
              },
            },
            {
              path: 'record',
              component: () => import('@/views/super-crm/wx-member/member-function/pages/wx-package/components/PackageRecord.vue'),
              meta: {
                title: '会员卡包',
                icon: 'icon-membership-card_icon',
              },
            },
          ]
        },
        {
          path: 'sign-every',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/SignEveryday.vue'),
          meta: {
            title: '每日签到',
            icon: 'icon-yuyue1',
          },
        },
        {
          path: 'score-record',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/ScoreRecord.vue'),
          meta: {
            title: '积分记录',
            icon: 'icon-yuyue1',
          },
        },
        {
          path: 'near-shop',
          component: () => import('@/views/super-crm/wx-member/member-function/pages/NearStore.vue'),
          meta: {
            title: '附近门店',
            icon: 'icon-yuyue1',
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
            icon: 'icon-huiyuan',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/member-register/components/Home.vue'),
              meta: {
                title: '微会员注册统计',
                icon: 'icon-huiyuanzhuce',
              },
            },
            {
              path: 'detail',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/member-register/components/Detail.vue'),
              meta: {
                title: '微会员注册统计',
                icon: 'icon-huiyuanzhuce',
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
            icon: 'icon-huiyuan',
          },
          children: [
            {
              path: 'total',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/shop-focus/components/Total.vue'),
              meta: {
                title: '门店关注统计',
                icon: 'icon-mendian',
              },
            },
            {
              path: 'detail',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/shop-focus/components/Detail.vue'),
              meta: {
                title: '门店关注统计',
                icon: 'icon-mendian',
              },
            },
          ]
        },
        {
          path: 'saleman-focus',
          component: () => import('@/views/super-crm/wx-member/data-statistics/pages/SalemanFocus.vue'),
          meta: {
            title: '营业员关注统计',
            icon: 'icon-xiaoshouyuanzhongxin',
          },
        },
        {
          path: 'function-focus',
          component: () => import('@/views/super-crm/wx-member/data-statistics/pages/function-focus/index.vue'),
          redirect: '/super-crm/wx-member/data-statistics/function-focus/home',
          meta: {
            title: '功能访问统计',
            icon: 'icon-huiyuan',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/function-focus/components/Home.vue'),
              meta: {
                title: '功能访问统计',
                icon: 'icon-gongneng',
              },
            },
            {
              path: 'item',
              component: () => import('@/views/super-crm/wx-member/data-statistics/pages/function-focus/components/Item.vue'),
              meta: {
                title: '功能访问统计',
                icon: 'icon-gongneng',
              },
            },
          ]
        },
        {
          path: 'member-activity',
          component: () => import('@/views/super-crm/wx-member/data-statistics/pages/MemberActivity.vue'),
          meta: {
            title: '会员活跃度统计',
            icon: 'icon-tongji',
          },
        }
      ]
    }
  ]
}


export default wxMemberRouter;
