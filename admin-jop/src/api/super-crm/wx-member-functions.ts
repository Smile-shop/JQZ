import request from '@/utils/request'
import { jopWXBaseUrl } from '@/api/pro-config'

// 查询在线预约
export function getWxAppointInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/reservationNew/lookProject`,
    method: `POST`,
    data
  })
}

// 设置预约是否显示
export function setAppointShow(data: any) {
  return request({
    url: `${jopWXBaseUrl}/reservationNew/updateProject`,
    method: `POST`,
    data
  })
}

// 删除在线预约
export function removeWxAppointInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/reservationNew/delProject`,
    method: `POST`,
    data
  })
}

// 在线预约记录
export function getAppointRecordList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/reservationNew/getRecord`,
    method: `POST`,
    data
  })
}

// 在线预约记录详情
export function getAppointDetail(data: any) {
  return request({
    url: `${jopWXBaseUrl}/reservationNew/getRecordDetail`,
    method: `POST`,
    data
  })
}

// 在线预约记录详情
export function getSalerByShop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/memberStatistics/employee`,
    method: `POST`,
    data
  })
}

// 查询所有门店
export function getAllShopList() {
  return request({
    url: `${jopWXBaseUrl}/wxShop/getWxShopWithShowStatusList`,
    method: `POST`,
    headers: {
      appCode: 'onlineMember'
    }
  })
}

// 查询已勾选门店
export function getSelectedShopList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/shopapi/list`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

// 品牌
export function brandList() {
  return request({
    url: `${jopWXBaseUrl}/companySettings/brandList`,
    method: `POST`,
    data: {}
  })
}

// 品牌绑定
export function shopBindBrand(data: any) {
  return request({
    url: `${jopWXBaseUrl}/companySettings/shopBindBrand`,
    method: `POST`,
    data
  })
}

// 检查是否重新生成二维码
export function checkResetQrcode() {
  return request({
    url: `${jopWXBaseUrl}/companySettings/checkResetQrcode`,
    method: `POST`,
    data: {}
  })
}

// 重新生成二维码
export function resetQrcode() {
  return request({
    url: `${jopWXBaseUrl}/companySettings/resetQrcode`,
    method: `POST`,
    data: {}
  })
}

// 保存一勾选门店
export function subEvaluationShop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/shopapi/updateStatus`,
    method: `POST`,
    data
  })
}
// 保存-勾选门店
export function updateShopStatus(data: any) {
  return request({
    url: `${jopWXBaseUrl}/shopapi/updateShopStatus`,
    method: `POST`,
    data
  })
}
// 评价维度
export function getEvaluationSettings() {
  return request({
    url: `${jopWXBaseUrl}/evaluation/querySettings`,
    method: `POST`,
    data: {}
  })
}

export function setEvaluationSettings(data: any) {
  return request({
    url: `${jopWXBaseUrl}/evaluation/customzieSettings`,
    method: `POST`,
    data
  })
}

// 客户评价记录
export function getEvalutionRecordList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/evaluation/record`,
    method: `POST`,
    data
  })
}

// 客户评价统计
export function getEvalutionTotal(data: any) {
  return request({
    url: `${jopWXBaseUrl}/evaluation/rank`,
    method: `POST`,
    data
  })
}

// 资讯中心
export function getCategory() {
  return request({
    url: `${jopWXBaseUrl}/news/category`,
    method: `POST`,
    data: {}
  })
}

export function setCategory(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/update_category`,
    method: `POST`,
    data
  })
}

export function removeCategory(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/remove_category`,
    method: `POST`,
    data
  })
}

export function addCategory(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/add_category`,
    method: `POST`,
    data
  })
}

export function getCategoryDetailList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/api_list`,
    method: `POST`,
    data
  })
}

export function removeCategoryDetail(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/remove_news`,
    method: `POST`,
    data
  })
}

export function removeCategoryDetailList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/removeAllNews`,
    method: `POST`,
    data
  })
}

export function getCategoryDetail(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/detail`,
    method: `POST`,
    data
  })
}

// 排序
export function tableSort(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/update_sort`,
    method: `POST`,
    data
  })
}

// 新增
export function addCategoryDetail(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/add_news`,
    method: `POST`,
    data
  })
}

// 修改
export function editCategoryDetail(data: any) {
  return request({
    url: `${jopWXBaseUrl}/news/update_news`,
    method: `POST`,
    data
  })
}

// 卡包
export function getMemberCardInfo() {
  return request({
    url: `${jopWXBaseUrl}/memberCard/cardInfoSet`,
    method: `POST`,
    data: {}
  })
}

export function creatQrImg(data: any) {
  return request({
    url: `${jopWXBaseUrl}/memberCard/createCardQrcode`,
    method: `POST`,
    data
  })
}

export function updateCardStatus(data: any) {
  return request({
    url: `${jopWXBaseUrl}/memberCard/updateCardStatus`,
    method: `POST`,
    data
  })
}

export function getMemberCardRecord(data: any) {
  return request({
    url: `${jopWXBaseUrl}/memberCard/qryCardCustomer`,
    method: `POST`,
    data
  })
}

export function createCardInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/memberCard/createCard`,
    method: `POST`,
    data
  })
}

export function postCardInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/memberCard/postCardInfo`,
    method: `POST`,
    data
  })
}

export function getCardInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/memberCard/getCardInfoSet`,
    method: `POST`,
    data
  })
}

// 积分记录
export function getScoreRecordList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/member/qryIntegralRecord`,
    method: `POST`,
    data
  })
}

export function getScoreTypeList() {
  return request({
    url: `${jopWXBaseUrl}/member/qryType`,
    method: `POST`
  })
}