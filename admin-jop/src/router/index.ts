/**
 * 每个项目的默认首页不能修改为某个子项目的首页, 如果该子项目未开通权限的话,整个大项目将无法进入
 */

import Vue from 'vue';
import Router from 'vue-router';

// == 超级CRM

import superCRMHome from './modules/super-crm/home';
import superCRMWxMemberRouter from './modules/super-crm/wx-member';
import superCRMWxQualityPolicy from './modules/super-crm/wx-quality-policy';
import superCRMWxChatRouter from './modules/super-crm/wx-chat';
import superCRMPointMallRouter from './modules/super-crm/point-mall';
import superCRMWxCredential from './modules/super-crm/wx-credential';
import superCRMWxMall from './modules/super-crm/wx-mall';
import superCRMWxWebSite from './modules/super-crm/wx-website';
import superCRMCloudShowroom from './modules/super-crm/cloud-showroom';
import superCRMSystemSetting from './modules/super-crm/system-settting';

// == 超级CKT

import superMKTHome from './modules/super-mkt/home';
// 活动设置
import superMKT from './modules/super-mkt/activity-set';
// 奖品设置
import superMKTPrizeSet from './modules/super-mkt/prize-set';
// 奖品设置
import superMKTMarketPromotion from './modules/super-mkt/market-promotion';

import superMKTSpreadSet from './modules/super-mkt/spread-set';

// == 超级APP
import superAPPHome from './modules/super-app/home';
// 会员管理
import superAPPMemberManage from './modules/super-app/member-manage';
// 客户端管理
import superAPPClientManage from './modules/super-app/client-manage';
// 金价
import superAPPGoldPrice from './modules/super-app/gold-price';

// == 云展厅
import cloudShowroomHome from './modules/cloud-showroom/home';
import cloudShowroomCloudShowroom from './modules/cloud-showroom/cloud-showroom';

// == 分销裂变
import fissionHome from './modules/fission/home';
import fissionDistriManage from './modules/fission/distri-manage';
import fissionOrder from './modules/fission/order-manage'
import fissionSetting from './modules/fission/setting'
import fissionOpeartion from './modules/fission/opeartion-manage'
import fissionWithdraw from './modules/fission/withdaw-manage'

// == 预存有礼
import prestoreHome from './modules/prestore/home';
import prestoreDistriManage from './modules/prestore/distri-manage';
import prestoreOrder from './modules/prestore/order-manage'
import prestoreSetting from './modules/prestore/setting'
import prestoreOpeartion from './modules/prestore/opeartion-manage'
import prestoreWithdraw from './modules/prestore/withdaw-manage'

// == 系统设置
import systemSet from './modules/system-set';

// 金千枝商学院
import schoolVideo from './modules/school-video';

Vue.use(Router);

// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push(location: any) {
   return (originalPush.call(this, location) as any).catch((err: any) => err)
}

export default new Router({
  routes: [
    // 登录页面
    {
      path: '/',
      redirect: '/login',
      meta: {
        isIgnore: true,
      },
    },
    // 登录页面
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        isIgnore: true,
      }
    },
    // 首页
    {
      path: '/home',
      component: () => import('@/layouts/LayoutOnlyHeader.vue'),
      redirect: '/home/module',
      meta: {
        isIgnore: true,
      },
      children: [
        {
          path: 'module',
          component: () => import('@/views/home/index.vue'),
        }
      ]
    },
    // 金千枝商学院
    {
      path: '/school-video',
      component: () => import('@/layouts/LayoutOnlyHeader.vue'),
      redirect: '/school-video/index',
      meta: {
        isIgnore: true,
      },
      children: [
        schoolVideo
      ]
    },
    // 超级CRM
    {
      path: '/super-crm',
      component: () => import('@/layouts/LayoutMain.vue'),
      redirect: '/super-crm/home',
      meta: {
        isModule: true,
        moduleName: '超级CRM',
        path: '/super-crm/home',
      },
      children: [
        // 首页
        superCRMHome,
        // 积分商城
        superCRMPointMallRouter,
        // 微会员
        superCRMWxMemberRouter,
        // 微客服
        superCRMWxChatRouter,
        // 微保单
        superCRMWxQualityPolicy,
        // 微证书
        superCRMWxCredential,
        // 微商城
        superCRMWxMall,
        // 微官网
        superCRMWxWebSite,
        // 云展厅
        // superCRMCloudShowroom,
        // 参数设置
        superCRMSystemSetting
      ]
    },
    // 超级MKT
    {
      path: '/super-mkt',
      component: () => import('@/layouts/LayoutMain.vue'),
      redirect: '/super-mkt/home',
      meta: {
        isModule: true,
        moduleName: '超级MKT',
        path: '/super-mkt/home'
      },
      children: [
        // 首页
        superMKTHome,
        // 活动设置
        superMKT,
        // 奖品设置
        superMKTPrizeSet,
        superMKTSpreadSet,
        superMKTPrizeSet,
        superMKTMarketPromotion
      ]
    },
    // 超级APP
    {
      path: '/super-app',
      component: () => import('@/layouts/LayoutMain.vue'),
      redirect: '/super-app/home',
      meta: {
        isModule: true,
        moduleName: '超级APP',
        path: '/super-app/home',
      },
      children: [
        superAPPHome,
        superAPPMemberManage,
        superAPPClientManage,
        superAPPGoldPrice
      ]
    },
    // 云展厅
    {
      path: '/cloud-showroom',
      component: () => import('@/layouts/LayoutMain.vue'),
      redirect: '/cloud-showroom/home',
      meta: {
        isModule: true,
        moduleName: '云展厅',
        path: '/cloud-showroom/home',
      },
      children: [
        cloudShowroomHome,
        cloudShowroomCloudShowroom
      ]
    },
    // 裂变分销
    {
      path: '/fission',
      component: () => import('@/layouts/LayoutMain.vue'),
      redirect: '/fission/home',
      meta: {
        isModule: true,
        moduleName: '裂变分销',
        path: '/fission/home',
      },
      children: [
        fissionHome,
        fissionDistriManage,
        fissionOrder,
        fissionWithdraw,
        fissionOpeartion,
        fissionSetting,
      ]
    },
    // 预存有礼
    {
      path: '/prestore',
      component: () => import('@/layouts/LayoutMain.vue'),
      redirect: '/prestore/home',
      meta: {
        isModule: true,
        moduleName: '预存有礼',
        path: '/prestore/home',
      },
      children: [
        prestoreHome,
        prestoreDistriManage,
        prestoreOrder,
        prestoreWithdraw,
        prestoreOpeartion,
        prestoreSetting,
      ]
    },
    // 系统设置
    systemSet
  ],
});
