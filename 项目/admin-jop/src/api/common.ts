import request from '@/utils/request'
import { jopAdminBaseUrl, jopWXBaseUrl, jopCustomerBaseUrl } from '@/api/pro-config'

// 上传图片
export function upload(data: any) {
  return request({
    url: `${jopWXBaseUrl}/file/upload`,
    method: 'POST',
    data,
  })
}

// 上传图片
export function marketupload(data: any) {
  return request({
    url: `${VUE_APP_BASE_API}/jop-marketing-web/market/upload`,
    method: 'POST',
    data,
  })
}

// 安卓今日金价
export function getShopList(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/appMenu/getAppPermissions`,
    method: 'POST',
    data,
  })
}

export function getAndroidShopTVInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/adTv/getAdTvInfo`,
    method: 'POST',
    data,
  })
}

export function updateTVPageStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/adTv/postAdTv`,
    method: 'POST',
    data,
  })
}

// 客资
export function getCustomerResourceStatistics() {
  return request({
    url: `${jopCustomerBaseUrl}/cr/statistics/index`,
    method: 'POST',
    data: {},
  })
}

export function getBasisData(data: any) {
  return request({
    url: `${jopCustomerBaseUrl}/cr/statistics/queryBasicInfo`,
    method: 'POST',
    data,
  })
}

export function removeBasisData(data: any) {
  return request({
    url: `${jopCustomerBaseUrl}/cr/statistics/deleteBasicInfo`,
    method: 'POST',
    data,
  })
}

export function updateBasisData(data: any) {
  return request({
    url: `${jopCustomerBaseUrl}/cr/statistics/saveOrUpdateBasicInfo`,
    method: 'POST',
    data,
  })
}

export function getJMPAccount() {
  return request({
    url: `${jopCustomerBaseUrl}/cr/statistics/queryJmpAccount`,
    method: 'POST',
    data: {},
  })
}