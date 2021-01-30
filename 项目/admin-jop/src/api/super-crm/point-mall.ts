import request from '@/utils/request'
import { jopAdminBaseUrl, jopWXBaseUrl, jopWebBaseUrl, jopCustomerBaseUrl } from '@/api/pro-config'

// 查询app样式
export function getAppStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/smallGifts/indexQuery`,
    method: `POST`,
    data,
  })
}

// 设置app样式
export function setAppStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/smallGifts/indexSave`,
    method: `POST`,
    data,
  })
}

// 查询兑换门店
export function getExchangeShop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/qryScoreShopName`,
    method: `POST`,
    data,
    headers: {
      appCode: `creditShop`,
    }
  })
}

// 设置兑换门店和首页显示数量
export function updateExchangeShop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/postScoreShopName`,
    method: `POST`,
    data,
    headers: {
      appCode: `creditShop`,
    }
  })
}

// 查询门店列表
export function getShop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/exchange_shop`,
    method: `POST`,
    data,
  })
}

// 获取兑换记录
export function getExchangeHistory(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/exchange_record`,
    method: `POST`,
    data,
  })
}

// 获取赠品信息
export function getProductInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/product_info`,
    method: `POST`,
    data,
  })
}

// 更新赠品详情
export function updateProductDetail(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/updateGiftDetail`,
    method: `POST`,
    data,
  })
}

// 获取赠品列表
export function getProductList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/product_list`,
    method: `POST`,
    data,
  })
}

// 获取赠品分类
export function getProductTyple(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/category`,
    method: `POST`,
    data,
  })
}

// 更新商品门店
export function updateGiftShop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/updateGiftShop`,
    method: `POST`,
    data,
  })
}


// 引导关注公众号提示
export function followCountTip(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMallSetting/giftShareStyleSetting`,
    method: 'POST',
    data,
  })
}

// 查询引导关注公众号设置
export function searchCountResublt() {
  return request({
    url: `${jopWXBaseUrl}/wxMallSetting/queryGiftShareStyle`,
    method: 'POST',
    data: {},
  })
}