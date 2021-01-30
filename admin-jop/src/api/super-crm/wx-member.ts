import request from '@/utils/request'
import { jopWXBaseUrl } from '@/api/pro-config'

// 查询门店
export function getWxShopList() {
  return request({
    url: `${jopWXBaseUrl}/wxShop/getWxShopWithShowStatusList`,
    method: `POST`,
    headers: {
      appCode: `onlineMember`
    }
  })
}

// 保存设置门店
export function setWxShopList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/postWxShopsettingsInfo`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

// 基础资料查询
export function getBasisData() {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryShareInfo`,
    method: `POST`,
  })
}

// 基础资料保存
export function setBasisData(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/updateWxCompany`,
    method: `POST`,
    data
  })
}
// 今日金价查询
export function qryGoldSetting(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryGoldSetting`,
    method: `GET`,
    data
  })
}

// 保存今日金价
export function goldSetting(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/goldSetting`,
    method: `POST`,
    data
  })
}

// 查询登录注册设置
export function getWxLoginRegister() {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryLoginSet`,
    method: `POST`,
  })
}

// 保存登录注册设置
export function setWxLoginRegister(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/updateWxRegister`,
    method: `POST`,
    data
  })
}

// 查询积分设置
export function getScoreSetting() {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/scoreSet`,
    method: `POST`,
  })
}

// 保存积分设置
export function setScoreSetting(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/updateScoreSet`,
    method: `POST`,
    data
  })
}

// 查询界面风格
export function getPageStyle() {
  return request({
    url: `${jopWXBaseUrl}/wxSurface/getSurfaceSet`,
    method: `POST`,
  })
}

// 保存界面风格
export function setPageStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxSurface/postSurfaceSet`,
    method: `POST`,
    data
  })
}

// 查询优惠券设置
export function getCouponSettings() {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/getCouponSet`,
    method: `POST`,
  })
}

// 保存优惠券设置
export function setCouponSettings(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/postCouponSet`,
    method: `POST`,
    data
  })
}

// 查询会员声明
export function getMemberStatement() {
  return request({
    url: `${jopWXBaseUrl}/wxExplain/getMemberExplain`,
    method: `POST`,
    data: {}
  })
}

// 保存会员声明
export function setMemberStatement(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxExplain/postOrUpdateMemberExplain`,
    method: `POST`,
    data
  })
}

// 查询门店推广二维码列表
export function getShopListInfo(data: any, headers?: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/getWxShopList`,
    method: `POST`,
    data,
    headers
  })
}

export function patchWxCodeShop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/patchWxCode`,
    method: `POST`,
    data
  })
}

// 查询营业员推广二维码列表
export function getSalerListInfo(data: any, headers?: any) {
  return request({
    url: `${jopWXBaseUrl}/wxSalesSet/getWxSaleInfo`,
    method: `POST`,
    data,
    headers
  })
}

export function patchWxCodeSaler(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxSalesSet/patchWxCode`,
    method: `POST`,
    data
  })
}

// 每日签到查询
export function getMemberSignSetting() {
  return request({
    url: `${jopWXBaseUrl}/sign/getMemberSign`,
    method: `POST`,
  })
}

// 每日签到保存
export function setMemberSignSetting(data: any) {
  return request({
    url: `${jopWXBaseUrl}/sign/updateMemberSign`,
    method: `POST`,
    data
  })
}

// 查询二维码模板
export function getCodeTemplate(data: any) {
  return request({
    url: `${jopWXBaseUrl}/codeTemplate/query`,
    method: `POST`,
    data
  })
}

// 删除模板
export function deleteCodeTemplate(data: any) {
  return request({
    url: `${jopWXBaseUrl}/codeTemplate/del`,
    method: `POST`,
    data
  })
}

// 新增模板
export function addCodeTemplate(data: any) {
  return request({
    url: `${jopWXBaseUrl}/codeTemplate/save`,
    method: `POST`,
    data
  })
}

// 修改模板
export function updateCodeTemplate(data: any) {
  return request({
    url: `${jopWXBaseUrl}/codeTemplate/update`,
    method: `POST`,
    data
  })
}

// 生成推广图片
export function builderQrcode(data: any) {
  return request({
    url: '/jop-wx-web/imagehandler/builderQrcode',
    method: 'GET',
    data
  })
}

// 生成推广图片
/* export function builderQrcode(data: any) {
  return request({
    url: '/jop-wx-web/imagehandler/builderQrcode',
    method: 'POST',
    responseType: 'blob',
    data
  })
} */

// 查询附近门店
export function getNearShop() {
  return request({
    url: `${jopWXBaseUrl}/wxShop/getWxNearbyShopList`,
    method: 'POST'
  })
}
// 设置附近门店
export function setNearShop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/batchNearbyShopInfo`,
    method: 'POST',
    data
  })
}
// 邀请设置查询
export function getWxCompanyInfo() {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/getWxCompanyInfo`,
    method: 'POST',
    data: {}
  })
}
// 邀请设置修改
export function updateWxCompany(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/updateWxCompany`,
    method: 'POST',
    data
  })
}

// 连单券首页列表
export function qryLianIndex(data: any) {
  return request({
    url: `${jopWXBaseUrl}/lianDanQuan/qryLianIndex`,
    method: 'POST',
    data
  })
}

// 连单券活动数据
export function lookData(data: any) {
  return request({
    url: `${jopWXBaseUrl}/lianDanQuan/look`,
    method: 'POST',
    data
  })
}

// 活动门店数据
export function queryStore(data: any) {
  return request({
    url: `${jopWXBaseUrl}/lianDanQuan/qryStore`,
    method: 'POST',
    data
  })
}

// 券详情
export function lookDetail(data: any) {
  return request({
    url: `${jopWXBaseUrl}/lianDanQuan/look/detail`,
    method: 'POST',
    data
  })
}

// 获取店铺可用券
export function qryStrategy(data: any) {
  return request({
    url: `${jopWXBaseUrl}/lianDanQuan/qryStrategy`,
    method: 'POST',
    data
  })
}

// 新增连单券活动
export function postLiandanquan(data: any) {
  return request({
    url: `${jopWXBaseUrl}/lianDanQuan/postLiandanquan`,
    method: 'POST',
    data
  })
}

// 获取连单券活动详情
export function queryLianDanQuan(data: any) {
  return request({
    url: `${jopWXBaseUrl}/lianDanQuan/queryLianDanQuan`,
    method: 'POST',
    data
  })
}

// 门店图片维护
export function uploadWxShopImg(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/uploadWxShopImg`,
    method: 'POST',
    data
  })
}

// 门店图片维护上传图片
export function upload(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/upload`,
    method: 'POST',
    data
  })
}

// 门店图片维护删除图片
export function deleteWxShopImg(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/deleteWxShopImg`,
    method: 'POST',
    data
  })
}

