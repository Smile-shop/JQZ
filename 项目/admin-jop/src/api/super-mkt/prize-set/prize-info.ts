import request from '@/utils/request'
import { jopMarketingWebBaseUrl } from '@/api/pro-config'

// 查询奖品类型列表
export function getGiftType(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryGiftType`,
    method: `POST`,
    data
  })
}

// 查询活动大类列表
export function getActivityType(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryActivityType`,
    method: `POST`,
    data
  })
}

// 查询活动名称列表
export function getActivityNameList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryActivityName`,
    method: `POST`,
    data
  })
}

// 查询奖品列表
export function getQiftManaList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/giftMana`,
    method: `POST`,
    data
  })
}

// 查询奖品详情
export function getGiftDetail(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryGiftDetail`,
    method: `POST`,
    data
  })
}

// 设置奖品详情
export function updateGiftDetail(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/updateGiftDetail`,
    method: `POST`,
    data
  })
}

// 根据giftCode查询关联活动
export function getActiveClzByGiftCode(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryActiveClzByGiftCode`,
    method: `POST`,
    data
  })
}

// 根据奖品查询相关活动信息
export function getActiveByGiftCode(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryActiveByGiftCode`,
    method: `POST`,
    data
  })
}

// 下载中奖记录
export function downloadWinningRecord(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActiveData/winningRecords`,
    method: 'POST',
    data
  })
}