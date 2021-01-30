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

// 状态修改
export function updatePaused(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/updatePaused`,
    method: `POST`,
    data
  })
}

// 九宫格删除活动
export function gameActiveDel(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/del`,
    method: `POST`,
    data
  })
}

// 游戏活动列表
export function queryActiveList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryActiveList`,
    method: `POST`,
    data
  })
}

// 暂停活动
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

// 添加活动名称
export function saveActivetitle(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/save`,
    method: `POST`,
    data
  })
}

// 九宫格活动基本信息保存
export function basicUpdate(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/update`,
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

// 九宫格获取活动基本信息
export function queryActive(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryActive`,
    method: `POST`,
    data
  })
}

// 获取门店信息
export function queryShopList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryShopList`,
    method: `POST`,
    data
  })
}

// 设置门店信息
export function updateShops(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/updateShops`,
    method: `POST`,
    data
  })
}

// 分享设置
export function updateShare(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/updateShare`,
    method: `POST`,
    data
  })
}

// 获取奖品设置列表信息
export function queryProducts(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryProducts`,
    method: `POST`,
    data
  })
}

// 活动奖品设置保存
export function productsSave(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/productsSave`,
    method: `POST`,
    data
  })
}

// 获取奖品列表
export function queryActiveAndJmpGift(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryActiveAndJmpGift`,
    method: `POST`,
    data
  })
}

// 九宫格活动数据信息
export function dataShow(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActiveData/dataShow`,
    method: `POST`,
    data
  })
}

// 参与纪录
export function joinRecords(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActiveData/joinRecords`,
    method: `POST`,
    data
  })
}

// 中奖纪录信息
export function winningRecords(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActiveData/winningRecords`,
    method: `POST`,
    data
  })
}

// 获取分享二维码
export function queryShare(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryShare`,
    method: `POST`,
    data
  })
}


// 新版九宫格分享体积
export function newUpdateShare(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/newUpdateShare`,
    method: 'POST',
    data
  })
}

// 发布游戏
export function publishNewGame(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/updateIsPublish`,
    method: 'POST',
    data,
  })
}
