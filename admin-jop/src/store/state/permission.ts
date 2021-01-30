// == 超级CRM
// 首页
import home from './modules/super-crm/home';
// 微会员路径
import wxMemberModuleMenu from './modules/super-crm/wxMember';
// 微好礼
import pointMallMenu from './modules/super-crm/point-mall';
// 微证书
import wxCredential from './modules/super-crm/wx-credential';
// 微保单
import wxQualityPolicy from './modules/super-crm/wxQualityPolicy';
// 微客服
import wxChatModuleMenu from './modules/super-crm/wxChat';
// 微客服
import wxMallModuleMenu from './modules/super-crm/wx-mall';
// 微客服
import wxWebsiteModuleMenu from './modules/super-crm/wx-website';
// 云展厅
import cloudShowroomMenu from './modules/super-crm/cloud-showroom';
// 参数设置
import systemSetting from './modules/super-crm/system-setting';

// 超级CRM
export const superCRM = {
  appName: '超级CRM',
  appCode: 'superCRM',
  canAccess: false,
  path: '/super-crm',
  children: [
    // 首页
    home,
    // 微会员
    wxMemberModuleMenu,
    // 微保单
    wxQualityPolicy,
    // 微好礼
    pointMallMenu,
    // 微证书
    wxCredential,
    // 微客服
    wxChatModuleMenu,
    // 微商城
    wxMallModuleMenu,
    // 微官网
    wxWebsiteModuleMenu,
    // 云展厅
    // cloudShowroomMenu,
    // 参数设置
    systemSetting,
  ]
}


// == 超级MKT

import superMKThome from './modules/super-mkt/home';
// 奖品设置
import superMKTPrizeSet from './modules/super-mkt/prize-set';
// 活动设置
import superMKTActivitySet from './modules/super-mkt/activity-set';
// 分销裂变改变活动设置
import fissionSuperMKTActivitySet from './modules/super-mkt/entry';
// 营销推广
import superMKTspreadSet from './modules/super-mkt/spread-set';

// 超级MKT
export const superMKT = {
  appName: '超级MKT',
  appCode: 'superMKT',
  canAccess: false,
  path: '/super-mkt',
  children: [
    superMKThome,
    // 分销裂变改变活动设置
    fissionSuperMKTActivitySet,
    // 奖品设置
    superMKTPrizeSet,
    // 活动设置
    superMKTActivitySet,
    // 营销推广
    superMKTspreadSet
  ]
}

// == 超级App
import superAPPHome from './modules/super-app/home';
import superAPPPhoneMemberManage from './modules/super-app/member-manage ';
import superAPPPhoneClientManage from './modules/super-app/client-manage';
import superAPPPhoneGoldPrice from './modules/super-app/gold-price';

export const superAPP = {
  appName: '超级App',
  appCode: 'superAPP',
  canAccess: false,
  path: '/super-app',
  children: [
    superAPPPhoneMemberManage,
    superAPPPhoneClientManage,
    superAPPPhoneGoldPrice,
    superAPPHome,
  ]
}

// == 云展厅
import cloudShowroomHome from './modules/cloud-showroom/home';
import cloudShowroomcloudShowroom from './modules/cloud-showroom/cloud-showroom';

export const cloudShowroom = {
  appName: '云展厅',
  appCode: 'CSR',
  canAccess: false,
  path: '/cloud-showroom',
  children: [
    cloudShowroomHome,
    cloudShowroomcloudShowroom,
  ]
}

// == 裂变分销
import fissionHome from './modules/fission/home';
import fissionDistriManage from './modules/fission/distri-manage';
import fissionOrder from './modules/fission/order-manage'
import fissionOpeartion from './modules/fission/opeartion-manage'
import fissionSetting from './modules/fission/setting'
import fissionWithdraw from './modules/fission/withdraw-manage'

// == 预存有礼
import prestoreHome from './modules/prestore/home';
import prestoreDistriManage from './modules/prestore/distri-manage';
import prestoreOrder from './modules/prestore/order-manage'
import prestoreOpeartion from './modules/prestore/opeartion-manage'
import prestoreSetting from './modules/prestore/setting'
import prestoreWithdraw from './modules/prestore/withdraw-manage'

export const fission = {
  appName: '裂变分销',
  appCode: 'DISTRI',
  canAccess: false,
  path: '/fission',
  children: [
    fissionHome,
    fissionDistriManage,
    fissionOrder,
    fissionWithdraw,
    fissionOpeartion,
    fissionSetting,
  ]
}

export const prestore = {
  appName: '预存有礼',
  appCode: 'DISTRI',
  canAccess: false,
  path: '/prestore',
  children: [
    prestoreHome,
    prestoreDistriManage,
    prestoreOrder,
    prestoreWithdraw,
    prestoreOpeartion,
    prestoreSetting,
  ]
}

// == 系统设置

import systemSetMsgValidate from './modules/system-set/msg-set';
import systemSetUserSetting from './modules/system-set/user-set';
import systemSetPictureSetting from './modules/system-set/picture-set';
import systemSetPasswordSetting from './modules/system-set/password-set';
import systemStoreSetting from './modules/system-set/store-set';
import notificationSetting from './modules/system-set/notification-set';

// 系统设置
export const systemSet = {
  appName: '系统设置',
  appCode: 'SYSET',
  canAccess: false,
  path: '/system-set',
  children: [
    // 用户维护
    systemSetUserSetting,
    // 门店管理
    systemStoreSetting,
    // 验证短信
    systemSetMsgValidate,
    // 图片
    systemSetPictureSetting,
    // 修改密码
    systemSetPasswordSetting,
    // 通知设置
    notificationSetting
  ]
}
