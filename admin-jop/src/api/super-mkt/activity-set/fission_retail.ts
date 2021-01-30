import request from '@/utils/request';
import { jopMarketingWebBaseUrl} from '@/api/pro-config';
// 查询门店列表
export function queryShopOutList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/distribution/queryShopOutList`,
    method: `POST`,
    data
  })
}
// 增加营销裂变第一步
export function addDistributionFrist(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/addDistributionFrist`,
      method: `POST`,
      data
    })
  }
// 增加营销裂变第二步
export function addDistributionSecond(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/addDistributionSecond`,
      method: `POST`,
      data
    })
}
// 增加营销裂变第三步
export function addDistributionThird(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/addDistributionThird`,
      method: `POST`,
      data
    })
}
// 获取营销裂变第四步
export function getDistributionFour(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/getDistributionFour`,
      method: `POST`,
      data
    })
}
// 获取营销裂变第一步
export function getDistributionFrist(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/getDistributionFrist`,
      method: `POST`,
      data
    })
}
// 获取营销裂变第二步
export function getDistributionSecond(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/getDistributionSecond`,
      method: `POST`,
      data
    })
}
// 获取营销裂变第三步
export function getDistributionThird(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/getDistributionThird`,
      method: `POST`,
      data
    })
}
// 增加营销裂变第四步
export function addDistributionFour(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/addDistributionFour`,
      method: `POST`,
      data
    })
}
// 查询营销裂变列表
export function queryDistributionPage(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/queryDistributionPage`,
      method: `POST`,
      data
    })
}
// 是否可买
export function updateIsCanBuy(data: any) {
    return request({
      url: `${jopMarketingWebBaseUrl}/distribution/updateIsCanBuy`,
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

// 核销员分页查询
export function pageQueryVerifier(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/feedbackVerify/pageQueryVerifier`,
    method: `POST`,
    params
  })
}

// 获取二维码
export function getQrcode(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/feedbackVerify/getQrcode`,
    method: `POST`,
    params
  })
}

// 扫码获取用户信息
export function getUserInfo(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/feedbackVerify/getUserInfo`,
    method: `POST`,
    params
  })
}

// 编辑核销员
export function addVerifier(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/feedbackVerify/addVerifier`,
    method: `POST`,
    data
  })
}

// 编辑核销员
export function updateVerifier(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/feedbackVerify/updateVerifier`,
    method: `POST`,
    data
  })
}

// 删除核销员
export function deleteVerifier(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/feedbackVerify/deleteVerifier`,
    method: `POST`,
    params
  })
}

// 获取所有核销员（包括已删除的）
export function getVerifierForOrder(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/feedbackVerify/getVerifierForOrder`,
    method: `POST`,
    params
  })
}

// 客服分页查询
export function pageQueryCustomerService(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/commSetting/pageQueryCustomerService`,
    method: `POST`,
    data
  })
}

// 用户分页查询
export function pageQueryUser(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/user/pageQueryUser`,
    method: `POST`,
    params
  })
}

// 用户统计查询
export function userStatistics(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/user/userStatistics`,
    method: `POST`,
    params
  })
}

// 用户Excel导出
export function userExport(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/user/export`,
    method: `POST`,
    params
  })
}

// 订单Excel导出
export function orderExport(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/order/export`,
    method: `POST`,
    data
  })
}

// 订单分页查询
export function pageQueryOrder(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/order/pageQueryOrder`,
    method: `POST`,
    data
  })
}

// 订单统计查询
export function countOrderRecord(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/order/countOrderRecord`,
    method: `POST`,
    params
  })
}

// 订单核销
export function verifyOrderJop(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/order/verifyOrderJop`,
    method: `POST`,
    params
  })
}

// 渠道分页查询
export function pageQueryChannel(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/commSetting/pageQueryChannel`,
    method: `POST`,
    params
  })
}

// 添加推广渠道
export function addDistributionChannel(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/commSetting/addDistributionChannel`,
    method: `POST`,
    data
  })
}

// 删除渠道
export function deleteChannel(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/commSetting/deleteChannel`,
    method: `POST`,
    params
  })
}

// 下载渠道二维码
export function downloadChannelQrCode(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/commSetting/downloadChannelQrCode`,
    method: `POST`,
    params
  })
}

// 返回渠道二维码
export function getChannelQrCode(params: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/commSetting/getChannelQrCode`,
    method: `POST`,
    params
  })
}







