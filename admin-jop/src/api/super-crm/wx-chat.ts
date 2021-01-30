import request from '@/utils/request'
import { chatWebBaseUrl, httpBaseUrl } from '@/api/pro-config'



// 查询微客服设置
export function getChatSet() {
  return request({
    url: `${chatWebBaseUrl}/chatSet/getSet`,
    method: `POST`
  })
}

// 保存微客服设置
export function setChatSet(data: any) {
  return request({
    url: `${chatWebBaseUrl}/chatSet/postChatSet`,
    method: `POST`,
    data
  })
}

// 客服管理
export function getChatShopList() {
  return request({
    url: `${httpBaseUrl}/jop-wx-web/onlineQuery/store`,
    method: `POST`,
    data: {}
  })
}

export function getCustomerList(data: any) {
  return request({
    url: `${chatWebBaseUrl}/chatInfo/getCustom`,
    method: `POST`,
    data
  })
}

export function updateCustom(data: any) {
  return request({
    url: `${chatWebBaseUrl}/chatInfo/updateCustom`,
    method: `POST`,
    data
  })
}

export function getChatInfoShopList() {
  return request({
    url: `${chatWebBaseUrl}/chatInfo/shopList`,
    method: `POST`,
    data: {}
  })
}

export function getChatInfoServiceList(data: any) {
  return request({
    url: `${chatWebBaseUrl}/chatInfo/kfList`,
    method: `POST`,
    data
  })
}

export function getChatSessionList(data: any) {
  return request({
    url: `${chatWebBaseUrl}/chatInfo/chatList`,
    method: `POST`,
    data
  })
}

export function getChatHistoryList(data: any) {
  return request({
    url: `${chatWebBaseUrl}/chatInfo/chatDetail`,
    method: `POST`,
    data
  })
}

// 报表
export function getChatHistory(data: any) {
  return request({
    url: `${chatWebBaseUrl}/chatInfo/statistic`,
    method: `POST`,
    data
  })
}

export function getTodayStatic(data: any) {
  return request({
    url: `${chatWebBaseUrl}/chatInfo/staticNum`,
    method: `POST`,
    data
  })
}

export function getChartData(data: any) {
  return request({
    url: `${chatWebBaseUrl}/chatInfo/getChart`,
    method: `POST`,
    data
  })
}
