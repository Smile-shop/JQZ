export default {
  path: 'activity-set',
  component: () => import('@/views/super-mkt/activity-set/index.vue'),
  // component: () => import('@/views/super-mkt/activity-set/activity-type/fission_retail/money-manage/applyWithDraw.vue'),
  meta: {
  },
  children: [
    // 活动类型
    {
      path: 'activity-type',
      component: () => import('@/views/super-mkt/activity-set/activity-type/index.vue'),
      meta: {
        title: '活动类型',
        icon: 'icon-shezhi1',
      },
      children: [
        {
          path: 'tiger',
          component: () => import('@/views/super-mkt/activity-set/activity-type/tiger/index.vue'),
          meta: {
            title: '老虎机',
            icon: 'icon-shezhi1',
          },
          redirect: '/super-mkt/activity-set/activity-type/tiger/home',
          children: [{
            path: 'home',
            component: () => import('@/views/super-mkt/activity-set/activity-type/tiger/Home.vue'),
            meta: {
              title: '老虎机',
              icon: 'icon-shezhi1',
            },
          }, {
            path: 'add',
            component: () => import('@/views/super-mkt/activity-set/activity-type/tiger/Add.vue'),
            meta: {
              title: '老虎机',
              icon: 'icon-shezhi1',
            },
          }, {
            path: 'viewdata',
            component: () => import('@/views/super-mkt/activity-set/activity-type/tiger/ViewData.vue'),
            meta: {
              title: '老虎机-活动数据',
              icon: 'icon-shezhi1',
            },
          }, {
            path: 'edit',
            component: () => import('@/views/super-mkt/activity-set/activity-type/tiger/Edit.vue'),
            meta: {
              title: '老虎机-活动设置',
              icon: 'icon-shezhi1',
            },
          }]
        },
        {
          path: 'fans_plus',
          component: () => import('@/views/super-mkt/activity-set/activity-type/fans_plus/index.vue'),
          redirect: '/super-mkt/activity-set/activity-type/fans_plus/home',
          meta: {
            title: '人气值千金PLUS',
            icon: 'icon-shezhi1',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans_plus/Home.vue'),
              meta: {
                title: '人气值千金PLUS',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'add',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans_plus/Add.vue'),
              meta: {
                title: '人气值千金PLUS',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'data',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans_plus/Data.vue'),
              meta: {
                title: '人气值千金',
                icon: 'icon-shezhi1',
              }
            },
            {
              path: 'prizeList',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans_plus/prizeList.vue'),
              meta: {
                title: '人气值千金PLUS - 奖品列表',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'recommend',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans_plus/DataHistoryRecommend.vue'),
              meta: {
                title: '人气值千金',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'prizeInfo',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans_plus/prizeInfo.vue'),
              meta: {
                title: '人气值千金PLUS',
                icon: 'icon-shezhi1',
              }
            }
          ]
        },
        {
          path: 'fans',
          component: () => import('@/views/super-mkt/activity-set/activity-type/fans/index.vue'),
          redirect: '/super-mkt/activity-set/activity-type/fans/home',
          meta: {
            title: '人气值千金',
            icon: 'icon-shezhi1',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans/Home.vue'),
              meta: {
                title: '人气值千金',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'add',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans/Add.vue'),
              meta: {
                title: '人气值千金',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'data',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans/Data.vue'),
              meta: {
                title: '人气值千金',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'recommend',
              component: () => import('@/views/super-mkt/activity-set/activity-type/fans/DataHistoryRecommend.vue'),
              meta: {
                title: '人气值千金',
                icon: 'icon-shezhi1',
              },
            },
          ]
        },
        {
          path: 'nine',
          component: () => import('@/views/super-mkt/activity-set/activity-type/nine/index.vue'),
          redirect: '/super-mkt/activity-set/activity-type/nine/home',
          meta: {
            title: '九宫格',
            icon: 'icon-shezhi1',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-mkt/activity-set/activity-type/nine/Home.vue'),
              meta: {
                title: '九宫格抽奖',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'add',
              component: () => import('@/views/super-mkt/activity-set/activity-type/nine/Add.vue'),
              meta: {
                title: '九宫格抽奖-添加活动',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'edit',
              component: () => import('@/views/super-mkt/activity-set/activity-type/nine/Edit.vue'),
              meta: {
                title: '九宫格抽奖-活动设置',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'viewdata',
              component: () => import('@/views/super-mkt/activity-set/activity-type/nine/viewdata.vue'),
              meta: {
                title: '九宫格抽奖-活动数据',
                icon: 'icon-shezhi1',
              },
            },
          ]
        },
        {
          path: 'red-envelope',
          component: () => import('@/views/super-mkt/activity-set/activity-type/red-envelope/index.vue'),
          redirect: '/super-mkt/activity-set/activity-type/red-envelope/home',
          meta: {
            title: '新春翻红包',
            icon: 'icon-shezhi1',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-mkt/activity-set/activity-type/red-envelope/Home.vue'),
              meta: {
                title: '新春翻红包-活动设置',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'add',
              component: () => import('@/views/super-mkt/activity-set/activity-type/red-envelope/Add.vue'),
              meta: {
                title: '新春翻红包-添加活动',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'data',
              component: () => import('@/views/super-mkt/activity-set/activity-type/red-envelope/Data.vue'),
              meta: {
                title: '新春翻红包-活动数据',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'edit',
              component: () => import('@/views/super-mkt/activity-set/activity-type/red-envelope/Edit.vue'),
              meta: {
                title: '新春翻红包-活动设置',
                icon: 'icon-shezhi1',
              },
            },
          ]
        },
        {
          path: 'rat',
          component: () => import('@/views/super-mkt/activity-set/activity-type/rat/index.vue'),
          redirect: '/super-mkt/activity-set/activity-type/rat/home',
          meta: {
            title: '鼠年大翻身',
            icon: 'icon-shezhi1',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-mkt/activity-set/activity-type/rat/Home.vue'),
              meta: {
                title: '鼠年大翻身-活动设置',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'add',
              component: () => import('@/views/super-mkt/activity-set/activity-type/rat/Add.vue'),
              meta: {
                title: '鼠年大翻身-添加活动',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'data',
              component: () => import('@/views/super-mkt/activity-set/activity-type/rat/Data.vue'),
              meta: {
                title: '鼠年大翻身-活动数据',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'edit',
              component: () => import('@/views/super-mkt/activity-set/activity-type/rat/Edit.vue'),
              meta: {
                title: '鼠年大翻身-活动设置',
                icon: 'icon-shezhi1',
              },
            },
          ]
        },
        {
          path: 'playing-card',
          component: () => import('@/views/super-mkt/activity-set/activity-type/playing-card/index.vue'),
          redirect: '/super-mkt/activity-set/activity-type/playing-card/home',
          meta: {
            title: '翻牌',
            icon: 'icon-shezhi1',
          },
          children: [
            {
              path: 'home',
              component: () => import('@/views/super-mkt/activity-set/activity-type/playing-card/Home.vue'),
              meta: {
                title: '翻牌-活动设置',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'add',
              component: () => import('@/views/super-mkt/activity-set/activity-type/playing-card/Add.vue'),
              meta: {
                title: '翻牌抽奖-添加活动',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'data',
              component: () => import('@/views/super-mkt/activity-set/activity-type/playing-card/Data.vue'),
              meta: {
                title: '翻牌-活动数据',
                icon: 'icon-shezhi1',
              },
            },
            {
              path: 'edit',
              component: () => import('@/views/super-mkt/activity-set/activity-type/playing-card/Edit.vue'),
              meta: {
                title: '翻牌抽奖-活动设置',
                icon: 'icon-shezhi1',
              },
            },
          ]
        },
      ]
    },
  ]
}
