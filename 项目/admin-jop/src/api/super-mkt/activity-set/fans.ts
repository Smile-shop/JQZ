import request from '@/utils/request'
import { jopMarketingWebBaseUrl } from '@/api/pro-config'

// 查询活动列表
export function getActiveList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryActiveList`,
    method: `POST`,
    data
  })
}

// 查询活动详情
export function getActiveInfo(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryActive`,
    method: `POST`,
    data
  })
}

// 删除活动
export function deleteActive(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/del`,
    method: `POST`,
    data
  })
}

// 暂停或启用活动
export function pauseActive(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/pauseActive`,
    method: `POST`,
    data
  })
}

// 结束活动
export function overActive(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/overActive`,
    method: `POST`,
    data
  })
}

// 查询门店列表
export function getShopList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryShopList`,
    method: `POST`,
    data
  })
}

// 添加活动/修改活动
export function addActive(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/save`,
    method: `POST`,
    data
  })
}

// 图片上传
export function uploadBgImg(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/upload`,
    method: `POST`,
    data
  })
}

// Top统计
export function getActivityTop(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/bop/activity/top`,
    method: `POST`,
    data
  })
}

// 活动数据（列表）
export function getActivityStatistics(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/bop/activity/statistics`,
    method: `POST`,
    data
  })
}

// 参与记录
export function getActivityJoinRecord(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/bop/activity/joinRecord`,
    method: `POST`,
    data
  })
}

// 用户推荐人列表（粉丝）
export function getActivityUserfans(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/bop/activity/userfans`,
    method: `POST`,
    data
  })
}