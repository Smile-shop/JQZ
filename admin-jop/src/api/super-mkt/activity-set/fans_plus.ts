import request from '@/utils/request';
import { jopMarketingWebBaseUrl, jopWXBaseUrl } from '@/api/pro-config';
import Axios from 'axios';

// 查询活动列表
export function queryWxActivePage(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryWxActivePage`,
    method: `POST`,
    data
  })
}
// 查询赠品列表
export function queryGiftPage(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryGiftPage`,
    method: `POST`,
    data
  })
}
// 获取活动第一步
export function getActiveFirst(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/market/getActiveFirst`,
      method: `POST`,
      data
    })
  }
// 获取活动第二步
export function getActiveSecond(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/getActiveSecond`,
    method: `POST`,
    data
  })
}
//  获取活动第三步
export function getActiveThree(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/getActiveThree`,
    method: `POST`,
    data
  })
}
// 获取活动第四步
export function getActiveFour(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/getActiveFour`,
    method: `POST`,
    data
  })
}
// 新增或修改活动第一步
export function saveActiveFirst(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/saveActiveFirst`,
    method: `POST`,
    data
  })
}
// 新增或修改活动第二步
export function saveActiveSecond(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/saveActiveSecond`,
    method: `POST`,
    data
  })
}
// 新增或修改活动第三步
export function saveActiveThree(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/saveActiveThree`,
    method: `POST`,
    data
  })
}
// 新增或修改活动第四步
export function saveActiveFour(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/saveActiveFour`,
    method: `POST`,
    data
  })
}
// 获取奖品列表
export function queryAwardList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryAwardList`,
    method: `POST`,
    data
  })
}
// 获取单个奖品
export function getAwardById(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/getAwardById`,
    method: `POST`,
    data
  })
}
// 更新奖品
export function updateAward(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/updateAward`,
    method: `POST`,
    data
  })
}
// 发放奖品明细
export function queryGetAwardPage(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryGetAwardPage`,
    method: `POST`,
    data
  })
}
// 发放奖品统计
export function queryGetAwardCount(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryGetAwardCount`,
    method: `POST`,
    data
  })
}

// 查询门店列表
export function queryShopOutList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryShopOutList`,
    method: `POST`,
    data
  })
}

// 结束活动
export function overWxActive(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/overWxActive`,
    method: `POST`,
    data
  })
}
// 查询黑名单
export function queryBlackUserPage(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryBlackUserPage`,
    method: `POST`,
    data
  })
}
// 删除黑名单
export function delBlackUser(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/delBlackUser`,
    method: `POST`,
    data
  })
}
// 删除活动
export function deleteWxActive(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/deleteWxActive`,
    method: `POST`,
    data
  })
}

// 发布活动
export function publishWxActive(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/publishWxActive`,
    method: `POST`,
    data
  })
}
// 获取活动推广二维码
export function showQrCode(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/showQrCode`,
    method: `POST`,
    data
  })
}

// 查询当前粉丝统计
export function getCurrentFansStatistics(data: any, headers?: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/activeStatistics/getCurrentFansStatistics`,
    method: `GET`,
    params: data,
    headers,
  })
}
// 查询粉丝统计
export function queryFansStatistics(data: any, headers?: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/activeStatistics/queryFansStatistics`,
    method: `GET`,
    params: data,
    headers,
  })
}
// 参与人统计
export function queryParPulStatistics(data: any, headers?: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/activeStatistics/queryParPulStatistics`,
    method: `GET`,
    params: data,
    headers
  })
}
// 微会员简介
export function getWxMemberBSummary(data: any, headers?: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/activeStatistics/getWxMemberBSummary`,
    method: `GET`,
    headers,
    params: data
  })
}
// 推荐人统计
export function queryRecommendStatistics(data: any, headers?: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/activeStatistics/queryRecommendStatistics`,
    method: `GET`,
    headers,
    params: data
  })
}




