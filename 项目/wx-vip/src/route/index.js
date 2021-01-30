import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
Vue.use(VueRouter);
const routeIndex = [
  {
    path: '/',
    // name: 'current',
    // redirect: '/index',
    meta: {
      titleName: '',
      hasNav: false
    }
  },
  {
    path: '/home',
    name: 'Index',
    component: () => import('@/views/Index.vue'),
    meta: {
      titleName: '首页',
      hasNav: false
    },
    children: [
      {
        path: '/share',
        name: 'Share',
        component: () => import('@/views/pages/Share.vue'),
        meta: {
          titleName: '邀请好友注册',
          hasNav: true
        }
      },
      // 优惠券
      {
        path: '/coupons/:id',
        name: 'Coupons',
        component: resolve => require(['@/views/pages/Coupons'], resolve),
        meta: {
          titleName: '优惠券',
          hasNav: true
        }
      },
      // 优惠券详情
      {
        path: '/cpsdtl',
        name: 'CouponDetails',
        component: resolve => require(['@/views/pages/CouponDetails'], resolve),
        meta: {
          titleName: '优惠券详情',
          hasNav: true
        }
      },
      // 积分记录
      {
        path: '/score-record',
        name: 'ScoreRecord',
        component: resolve => require(['@/views/pages/ScoreRecord'], resolve),
        meta: {
          titleName: '积分记录',
          hasNav: true
        }
      },
      // 质保单
      {
        path: '/consume-record',
        name: 'ConsumeRecord',
        component: resolve => require(['@/views/pages/ConsumeRecord'], resolve),
        meta: {
          titleName: '质保单',
          hasNav: true
        }
      },
      // 质保单详情
      {
        path: '/consume-details',
        name: 'ConsumeDetails',
        component: resolve => require(['@/views/pages/ConsumeDetails'], resolve),
        meta: {
          titleName: '质保单详情',
          hasNav: true
        }
      },
      // 会员声明
      {
        path: '/mber-state',
        name: 'MemberStatement',
        component: resolve => require(['@/views/pages/MemberStatement'], resolve),
        meta: {
          titleName: '会员声明',
          hasNav: false
        }
      },
      // 附近门店
      {
        path: '/near-stores',
        name: 'NearbyStores',
        component: resolve => require(['@/views/pages/NearbyStores'], resolve),
        meta: {
          titleName: '附近门店',
          hasNav: true
        }
      },
      // 今日金价
      {
        path: '/gold-price',
        name: 'GoldPrice',
        component: resolve => require(['@/views/pages/GoldPrice'], resolve),
        meta: {
          titleName: '今日金价',
          hasNav: true
        }
      },
      // 系统设置
      {
        path: '/sys-set',
        name: 'SystemSettings',
        component: resolve => require(['@/views/pages/SystemSettings'], resolve),
        meta: {
          titleName: '系统设置',
          hasNav: true
        }
      },
      // 重置密码
      {
        path: '/reset-psd',
        name: 'ResetPassword',
        component: resolve => require(['@/views/pages/ResetPassword'], resolve),
        meta: {
          titleName: '重置密码',
          hasNav: true
        }
      },
      // 个人信息
      {
        path: '/per-info',
        name: 'PersonalInfo',
        component: resolve => require(['@/views/pages/PersonalInfo'], resolve),
        meta: {
          titleName: '个人信息',
          hasNav: false
        }
      },
      // 修改个人信息
      {
        path: '/up-info',
        name: 'UpdateInfo',
        component: resolve => require(['@/views/pages/UpdateInfo'], resolve),
        meta: {
          titleName: '修改个人信息',
          hasNav: true
        }
      },
      // 邀请码详解
      {
        path: '/code-intro',
        name: 'InivateCode',
        component: resolve => require(['@/views/pages/InivateCode'], resolve),
        meta: {
          titleName: '邀请码',
          hasNav: true
        }
      },
      // 资讯中心
      {
        path: '/consult',
        name: 'ConsultCenter',
        component: resolve => require(['@/views/pages/ConsultCenter'], resolve),
        meta: {
          titleName: '资讯中心',
          hasNav: true
        }
      },
      // 资讯详情
      {
        path: '/consult-details/:id',
        name: 'ConsultDetails',
        component: resolve => require(['@/views/pages/ConsultDetails'], resolve),
        meta: {
          titleName: '资讯中心',
          hasNav: true
        }
      },
      {
        path: '/sign',
        name: 'MemberSign',
        component: resolve => require(['@/views/pages/MemberSign'], resolve),
        meta: {
          titleName: '会员签到',
          hasNav: true
        }
      },
      {
        path: '/evaluation',
        name: 'Evaluation',
        component: resolve => require(['@/views/pages/Evaluation'], resolve),
        meta: {
          titleName: '满意度调研',
          hasNav: false
        }
      },
      {
        path: '/evaluation-list',
        name: 'EvaluationList',
        component: resolve => require(['@/views/pages/EvaluationList'], resolve),
        meta: {
          titleName: '我的评价',
          hasNav: true,
        }
      },
      {
        path: '/evaluation-record',
        name: 'EvaluationRecord',
        component: resolve => require(['@/views/pages/EvaluationRecord'], resolve),
        meta: {
          titleName: '我的评价',
          hasNav: true,
        }
      },
      // 在线预约
      {
        path: '/app-online',
        name: 'AppointOnline',
        component: resolve => require(['@/views/pages/AppointOnline'], resolve),
        meta: {
          titleName: '在线预约',
          hasNav: false
        }
      },
      // 在线预约
      {
        path: '/to-app-online',
        name: 'AppointOnline1',
        component: resolve => require(['@/views/pages/AppointOnline1'], resolve),
        meta: {
          titleName: '在线预约',
          hasNav: false
        }
      },
      // 预记录约
      {
        path: '/app-record',
        name: 'AppointRecord',
        component: resolve => require(['@/views/pages/AppointRecord'], resolve),
        meta: {
          titleName: '我的预约',
          hasNav: true
        }
      },
      {
        path: '/appoint-detail',
        name: 'AppointDetail',
        component: resolve => require(['@/views/pages/AppointDetail'], resolve),
        meta: {
          titleName: '预约详情',
          hasNav: true
        },
      },
      // {
      //   path: '/data',
      //   name: 'Data',
      //   component: resolve => require(['@/views/pages/Data'], resolve),
      //   meta: {
      //     titleName: '填写资料',
      //     hasNav: true
      //   }
      // },
			{
			  path: '/submit',
			  name: 'Submit',
			  component: resolve => require(['@/views/pages/Submit'], resolve),
			  meta: {
			    titleName: '提交成功',
			    hasNav: true
			  }
      },
      // {
			//   path: '/exchange',
			//   name: 'Exchange',
			//   component: resolve => require(['@/views/pages/Exchange'], resolve),
			//   meta: {
			//     titleName: '兑换成功',
			//     hasNav: true
			//   }
			// },
			// {
			//   path: '/change-data',
			//   name: 'ChangeData',
			//   component: resolve => require(['@/views/pages/ChangeData'], resolve),
			//   meta: {
			//     titleName: '兑换资料',
			//     hasNav: true
			//   }
      // },
      {
			  path: '/link-coupon',
			  name: 'LinkCoupon',
			  component: resolve => require(['@/views/pages/LinkCoupon'], resolve),
			  meta: {
			    titleName: '幸运刮刮乐',
			    hasNav: true
			  }
			}
    ]
  }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: routeIndex
});

// 判断是否需要权限
router.beforeEach((to, from, next) => {
  if (from.query && from.query.c && from.query.o) {
    store.commit('isFirstPage', false);
  } else {
    store.commit('isFirstPage', true);
  }
  document.title = to.meta.titleName;
  next();
})

export default router;

