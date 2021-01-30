import http from '@/utils/http';
const origin = window.VUE_APP_BASE_API;

// 获取用户信息
export async function getUserInfo(body: any) {
  return http('/jop-marketing-web/wxFront/getUserInfo', {
    body,
    method: 'POST',
    deleteHeaders: [body.code ? 'userId' : ''],
  });
}

// jssdk初始化
export async function initWechatJsSdk(body: any) {
  return http('/jop-web/wxinit/jsapi_ticketSign', {
    body,
    method: 'POST',
  });
}

// 首页信息
export async function getMainInfo(body: any) {
  return http('/jop-marketing-web/distributionFront/getMainInfo', {
    body,
    method: 'GET',
  });
}

// 查询分销排行榜
export async function queryRanking(body: any) {
  return http('/jop-marketing-web/distributionFront/queryRanking', {
    body,
    method: 'GET',
  });
}

// 查询邀请记录
export async function queryUserInviteRecord(body: any) {
  return http('/jop-marketing-web/distributionFront/queryUserInviteRecord', {
    body,
    method: 'GET',
  });
}

// 支付
export async function asynNotify(body: any) {
  return http('/jop-marketing-web/userFront/asynNotify', {
    body,
    method: 'GET',
  });
}

// 分销海报
export async function getDistributionPosters(body: any) {
  return http('/jop-marketing-web/userFront/getDistributionPosters', {
    body,
    method: 'GET',
  });
}

// 门店信息
export async function shopinfo(body: any) {
  return http('/jop-marketing-web/distributionFront/shopinfo', {
    body,
    method: 'POST',
  })
}

// 兑换表单信息
export async function getExchangeFormInfo(body: any) {
  return http('/jop-marketing-web/orderFront/getExchangeFormInfo', {
    body,
    method: 'GET',
  })
}

// 添加反馈
export async function addFeedback(body: any) {
  return http('/jop-marketing-web/feedbackVerify/addFeedback', {
    body,
    method: 'POST',
  });
}

// 订单核销信息查询
export async function getVerifyInfo(body: any) {
  const { orderNo, verifierOpenId } = body
  return http(`/jop-marketing-web/order/getVerifyInfo?orderNo=${orderNo || ''}&verifierOpenId=${verifierOpenId || ''}`, {
    method: 'POST',
  });
}

// 订单核销
export async function verifyOrder(body: any) {
  const { orderNo, verifierOpenId } = body
  return http(`/jop-marketing-web/order/verifyOrder?orderNo=${orderNo || ''}&verifierOpenId=${verifierOpenId || ''}`, {
    method: 'POST',
  });
}

// 获取验证码
export async function captcha(body: any) {
  return http('/jop-marketing-web/wxFront/captcha', {
    body,
    method: 'GET',
  });
}

// 提现
export async function addWithdraw(body: any) {
  return http('/jop-marketing-web/userFront/addWithdraw', {
    body,
    method: 'GET',
    notPretreatmentData: true
  });
}

// 添加订单
export async function addOrderApi(body: any) {
  return http('/jop-marketing-web/orderFront/save', {
    body,
    method: 'POST',
  });
}

// 支付
export async function getWXPrepayRsp(body: any) {
  return http('/jop-marketing-web/userFront/getWXPrepayRsp', {
    body,
    method: 'GET',
  });
}

// 提交领取表单
export async function directRegist(body: any) {
  return http('/jop-marketing-web/wxFront/directRegist', {
    body,
    method: 'POST',
  });
}

// 图形验证码
export async function imageVerificationCode(body: any) {
  return http('/jop-marketing-web/wxFront/captcha', {
    body,
    method: 'GET',
  });
}

// 短信验证码
export async function sendPhoneMsg(body: any) {
  return http('/jop-web/wxCode/sendPhoneMsg', {
    body,
    method: 'POST',
    deleteHeaders: ['companyKey', 'distributionId', 'openid', 'userId', 'channelId']
  });
}

// 订单信息
export async function getExchangeInfo(body: any) {
  return http('/jop-marketing-web/orderFront/getExchangeInfo', {
    body,
    method: 'GET',
  });
}

// 订单二维码
export async function getExchangeQrcode(body: any) {
  return http('/jop-marketing-web/orderFront/getExchangeQrcode', {
    body,
    method: 'GET',
  });
}

// 获取分享信息
export async function getShareInfo(body: any) {
  return http('/jop-marketing-web/distributionIndexFront/getShareInfo', {
    body,
    method: 'GET',
  });
}
