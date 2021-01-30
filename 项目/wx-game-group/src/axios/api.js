import Vue from 'vue';
import request from './request';
import axios from 'axios'

//请求接口
const userUrl = '/jop-marketing-web/gift';
const baseurl = '/jop-marketing-web/wx/game';
const shareurl = 'jop-web/wxinit';
const BASEMARKETING = '/jop-marketing-web'

//首页
export function Home(data) {
  return request({
    method: 'POST',
    url: `${baseurl}/queryGameActive`,
    data,
  })
}

// 开始抽奖
export function startDraw(data) {
  return request({
    method: "POST",
    url: `${baseurl}/startDraw`,
    data
  })
}
// export function startDraw(data, that) {
//   return request({
//     method: "POST",
//     url: `${baseurl}/startDraw`,
//     data,
//     cancelToken: new axios.CancelToken(function executor(c) { // 设置 cancel token
//       that._data.source = c;
//     })
//   })
// }

// 小游戏中奖纪录列表
export function giftRecords(data) {
  return request({
    method: "POST",
    url: `${baseurl}/giftRecords`,
    data,
  })
}

//游戏详情
export function gameDetails(data) {
  return request({
    method: 'POST',
    url: `${baseurl}/gameDetails`,
    data,
  })
}

// 九宫格活动列表
export function activeInProducts(data) {
  return request({
    method: 'POST',
    url: `${baseurl}/activeInProducts`,
    data,
  })
}

// 我的礼品列表
export function queryGift(data) {
  return request({
    method: 'POST',
    url: `${userUrl}/query`,
    data,
  })
}

// 查询门店列表
export function shopinfo(data) {
  return request({
    method: 'POST',
    url: `${baseurl}/shopinfo`,
    data,
  })
}

// 提交领奖信息
export function entityGiftSave(data) {
  return request({
    method: 'POST',
    url: `${baseurl}/entityGiftSave`,
    data,
  })
}

export function share(data) {
  console.log('分享请求', data)
  axios.defaults.baseURL = Vue.prototype.httpUrl;
  let options = {
    method: "POST",
    url: "/jop-web/wxinit/jsapi_ticketSign",
    data: data
  }
  return new Promise((resolve, reject) => {

    axios(options).then((res) => {
      let { data, code, msg } = res.data
      if (code == 0) {
        resolve(data)
      } else {
        reject(msg)
      }

    }).catch((err) => {
      reject(err)
    })

  })
}


export function mygiftList(data) {
  return request({
    method: 'POST',
    url: `${baseurl}/giftList`,
    data,
  })
}


// 分享 定位
export function wxShareInit(data) {
  return request({
    method: 'POST',
    url: `${shareurl}/jsapi_ticketSign`,
    data,
  })
}


// 分享统计
export function computeShareCount(data) {
  return request({
    method: 'POST',
    url: `${baseurl}/share`,
    data,
  })
}


// 会员领取奖品
export function queryBillDetail(data) {
  return request({
    method: 'POST',
    url: `${baseurl}/queryBillDetail`,
    data,
  })
}

// 登录领奖活动奖品信息
export function loginGift(data) {
  return request({
    method: 'POST',
    url: `${baseurl}/login`,
    data,
  })
}

// 礼品详情
export function queryGiftDetail(data) {
  return request({
    method: 'POST',
    url: '/jop-marketing-web/market/queryGiftDetail',
    data,
  })
}

// 营销推广列表查询
export function querySchemeList(data) {
  return request({
    method: 'POST',
    url: `${BASEMARKETING}/activeExtension/querySchemeList`,
    data,
  })
}

// 分享查询
export function queryShare(data = {}) {
  return request({
    method: 'POST',
    url: `${BASEMARKETING}/gameActive/queryShare`,
    data,
  })
}