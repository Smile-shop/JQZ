import { http, getOrigin } from '../utils/index';

// 检查功能权限
export async function checkFunctionalPermission(body) {
  return await http({
    url: '/jop-wx-web/active/checkFunctionalPermission',
    method: 'GET',
    data: body
  });
}

/**
 * @description 登录
 * @param {object} body 
 * @param {string} body.js_code 
 */
export async function login(body) {
  return await http({
    url: '/jop-marketing-web/wx/wxapp/login',
    method: 'POST',
    data: body
  });
}

/**
 * @description 解密电话号码
 * @param {object} body 
 * @param {string} body.iv
 * @param {string} body.encryptedData
 */
export async function decodePhoneNumber(body) {
  return await http({
    url: '/jop-marketing-web/wx/wxapp/decryptMsg',
    method: 'POST',
    data: body
  });
}

/**
 * @description 门店列表
 * @param {object} body 
 * @param {string} body.activityId 
 */
export async function getShopInfo(body) {
  return await http({
    url: '/jop-web/integral/shopinfo',
    method: 'POST',
    data: body
  });
}

/**
 * @description 更新微信信息
 * @param {object} body 
 * @param {string} body.mobile 
 */
export async function updateWxUserInfo(body) {
  return await http({
    url: '/jop-marketing-web/wx/wxapp/updateWxUserInfo',
    method: 'POST',
    data: body
  });
}

/**
 * @description 注册会员
 * @param {object} body
 * @param {string} body.companyKey
 * @param {string} body.openid
 * @param {string} body.phone
 * @param {string} body.name
 * @param {string} body.memberNum 
 * @param {string} body.cardNum 
 * @param {string} body.branchShop 
 * @param {string} body.sysRegister - Y或者N
 */
export async function directRegist(body) {
  return await http({
    url: '/jop-marketing-web/wx/directRegist',
    method: 'POST',
    data: body
  });
}

// 根据会员ID查询人气值
export async function getPopularValueByWmid(body) {
  return await http({
    url: '/jop-wx-web/active/getPopularValueByWmid',
    method: 'GET',
    data: body
  });
}

// 查询主页信息
export async function getMainInfo(body) {
  return await http({
    url: '/jop-wx-web/active/getMainInfo',
    method: 'GET',
    data: body
  });
}

// 根据赠品ID查询活动礼品
export async function getActiveGiftByGiftId(body) {
  return await http({
    url: '/jop-wx-web/activeGift/getActiveGiftByGiftId',
    method: 'GET',
    data: body
  });
}

// 根据活动ID查询活动礼品
export async function queryActiveGiftByActiveId(body) {
  return await http({
    url: '/jop-wx-web/activeGift/queryActiveGiftByActiveId',
    method: 'GET',
    data: body
  });
}

// 查看我的奖品
export async function getMyPrizes(body) {
  return await http({
    url: '/jop-marketing-web/gift/query',
    method: 'POST',
    data: body
  });
}

// 根据条件查询好友助力列表
export async function queryFriendsHelp(body) {
  return await http({
    url: '/jop-wx-web/activeRanking/queryFriendsHelp',
    method: 'GET',
    data: body
  });
}

// 根据活动ID查询人气值
export async function queryPopularValueByActiveId(body) {
  return await http({
    url: '/jop-wx-web/activeRanking/queryPopularValueByActiveId',
    method: 'GET',
    data: body
  });
}

// 查询微会员简介
export async function getWxMemberSummary(body) {
  return await http({
    url: '/jop-wx-web/activeWMember/getWxMemberSummary',
    method: 'GET',
    data: body
  });
}

// 添加奖品订单
export async function addGiftOrder(body) {
  return await http({
    url: '/jop-wx-web/activeGiftOrder/addGiftOrder',
    method: 'POST',
    data: body
  });
}

// 查询我的奖品
export async function queryGiftOrder(body) {
  return await http({
    url: '/jop-wx-web/activeGiftOrder/queryGiftOrder',
    method: 'GET',
    data: body
  });
}

// 查询奖品订单
export async function getGiftOrder(body) {
  return await http({
    url: '/jop-wx-web/activeGiftOrder/getGiftOrder',
    method: 'GET',
    data: body
  });
}

// 条形码
export function barcode(body) {
  const origin = getOrigin();
  const { memberCard, orderId } = body;
  return `${origin}/jop-wx-web/active/barcode?memberCard=${memberCard}&orderId=${orderId}`
}

// 二维码
export function qrcode(body) {
  const origin = getOrigin();
  const { memberCard, orderId } = body;
  return `${origin}/jop-wx-web/active/qrcode?memberCard=${memberCard}&orderId=${orderId}`
}

// 确认订单
export async function updateConfirmOrder(body) {
  return await http({
    url: '/jop-wx-web/activeGiftOrder/updateConfirmOrder',
    method: 'POST',
    data: body
  });
}