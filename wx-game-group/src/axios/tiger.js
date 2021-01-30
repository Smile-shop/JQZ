import request from './request'
import { getLocalStorage } from '@/utils/local-storage'

const JOP_MARKETING = 'jop-marketing-web'
const JOP_WEB = 'jop-web'
const SHOP_WEB = 'shop-web'

export function giftRecords(data) {
  return request({
    url: `${JOP_MARKETING}/wx/game/giftRecords`,
    method: 'POST',
    data
  })
}

export function activeInProducts(data) {
  return request({
    url: `${JOP_MARKETING}/wx/game/activeInProducts`,
    method: 'POST',
    data
  })
}

export function startDraw(data) {
  return request({
    url: `${JOP_MARKETING}/wx/game/startDraw`,
    method: 'POST',
    data,
    headers: {
      openid: getLocalStorage().openid,
      channel: 'wx'
    }
  })
}

// 游戏详情
export function gameDetails(data) {
  return request({
    url: `${JOP_MARKETING}/wx/game/newGameDetails`,
    method: 'POST',
    data,
    headers: {
      openid: getLocalStorage().openid
    }
  })
}

export function showCount(data) {
  return request({
    url: `${JOP_MARKETING}/wx/game/showCount`,
    method: 'POST',
    data
  })
}

// 获取微信签名
export function getwxToken(data) {
  console.log('老虎机获取微信签名', data)
  const { companyKey } = data
  data.companyKey = companyKey.includes('?') ? companyKey.split('?')[0] : companyKey
  console.log('上传微信签名', data)
  return request({
    url: `${JOP_WEB}/wxinit/jsapi_ticketSign`,
    method: 'POST',
    data
  })
}

export function queryShare(data) {
  return request({
    url: `${JOP_MARKETING}/gameActive/queryShare`,
    method: 'POST',
    data
  })
}

// 营销推广列表查询
export function querySchemeList(data) {
  return request({
    url: `${JOP_MARKETING}/activeExtension/querySchemeList`,
    method: 'POST',
    data
  })
}

// 微商城
export function productList(data) {
  return request({
    url: `${SHOP_WEB}/mall/productList`,
    method: 'POST',
    data
  })
}

// 积分兑好礼
export function scoreProductList(data) {
  return request({
    url: `${JOP_WEB}/integral/product_list`,
    method: 'POST',
    data
  })
}

// 活动奖品详情
export function queryGiftDetail(data) {
  return request({
    url: `${JOP_MARKETING}/market/queryGiftDetail`,
    method: 'POST',
    data
  })
}

// 分享增加抽奖次数
export function shareSuccess(data) {
  return request({
    headers: {
      openid: getLocalStorage().openid
    },
    url: `${JOP_MARKETING}/wx/game/shareSuccess`,
    method: 'POST',
    data
  })
}

// 分享统计
export function shareCounter(data) {
  return request({
    headers: {
      openid: getLocalStorage().openid
    },
    url: `${JOP_MARKETING}/wx/game/share`,
    method: 'POST',
    data
  })
}

export function wxRegistType(data) {
  return request({
    url: `${JOP_WEB}/wxBind/wxRegistType`,
    method: 'POST',
    data
  })
}
