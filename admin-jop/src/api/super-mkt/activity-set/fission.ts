import request from '@/utils/request';
import { jopMarketingWebBaseUrl } from '@/api/pro-config'
// const hostName = getLocalIp()
// const jopMarketingWebBaseUrl = `http://${hostName}:3000`;

function getLocalIp() {
  const base = window.location.hostname
  const port = window.location.port
  const mark = 'localhost'
  let result = ''
  if (base === mark) {
    window.alert('请使用IP地址打开网址')
    window.open(`http://${base}:${port}`)
    return
  } else {
    result = base
  }

  return result
}

// 创建请求
function createRequest(url: string, params = {}, rqM = 'POST') {
  return request({
    url: `${jopMarketingWebBaseUrl}/${url}`,
    method: rqM,
    data: params,
  })
}

// 查询客服列表
export function searchCustomerList(options: any) {
  const s = 'commSetting/pageQueryCustomerService'
  return createRequest(s, options)
}

// 提现列表
export function withdrawList(options: any) {
  const { pageNum, pageSize } = options
  const l = 'fundManage/queryCompanyWithdrawalPage' + `?pageNum=${pageNum}&pageSize=${pageSize}`
  return createRequest(l, options)
}

// 提现统计
export function widthTotal(options: any) {
  const t = 'fundManage/getCompanyAccountCount'
  return createRequest(t, options)
}

// 活动反馈
export function operation(options: any) {
  const { beginTime, distributionId, endTime, pageNum, pageSize, type } = options
  const p = `?type=${type}&pageSize=${pageSize}&pageNum=${pageNum}&endTime=${endTime}&distributionId=${distributionId}&beginTime=${beginTime}`
  const c = 'feedbackVerify/pageQueryFeedback' + p
  return createRequest(c, options)
}

// 资金明细
export function moneyDetail(options: any) {
  const { pageNum, pageSize } = options
  const m = 'fundManage/queryFundRecordPage' + `?pageNum=${pageNum}&pageSize=${pageSize}`
  return createRequest(m, options)
}

// 导出资金数据
export function exportMoneyData(options: any) {
  const e = 'fundManage/export'
  return createRequest(e, options)
}

// 搜索活动资金明细
export function searchAcitveDetail(options: any) {
  return createRequest('searchAcitveDetail', options)
}

// 提现列表搜索
export function withdrawListSearch(options: any) {
  return createRequest('withdrawListSearch', options)
}

// 查询提现卡号
export function searchWidthdrawCard(options: any) {
  const c = 'fundManage/queryWithdrawAccount'
  return createRequest(c, options)
}

// 查询活动
export function searchActivityList(options: any) {
  const a = 'distribution/queryDistributionPage'
  return createRequest(a, options)
}

// 查询订单详情
export function queryOrderDetails(options: any) {
  return createRequest('queryOrderDetails', options)
}

// 获取二维码
export function getQrcode(options: any) {
  const { randomCode } = options
  const q = `feedbackVerify/getQrcode?randomCode=${randomCode}`
  return createRequest(q, options)
}

// 获取微信授权
export function queryWxAuth(options: any) {
  const { randomCode } = options
  const a = `feedbackVerify/getUserInfo?randomCode=${randomCode}`
  return createRequest(a, options)
}

// 添加提现卡
export function submitCardInfo(options: any) {
  const a = 'fundManage/addAccount'
  return createRequest(a, options)
}

// 申请提现
export function applayWithDrawAmount(options: any) {
  const { accountId, phone, userId, verifyCode, withdrawAmount } = options
  const q = `?accountId=${accountId}&phone=${phone}&userId=${userId}&verifyCode=${verifyCode}&withdrawAmount=${withdrawAmount}`
  const a = 'fundManage/addWithdraw' + q
  return createRequest(a, options)
}

// 商家设置
export function merchantSettings(options: any) {
  const s = 'commSetting/addOrUpdateMerchantSetting'
  return createRequest(s, options)
}

// 查询商家配置
export function queryMerchantSettings(options: any) {
  const q = 'commSetting/getMerchantSetting'
  return createRequest(q, options)
}

// 获取客户手机号
export function getPhone(options: any) {
  const q = 'fundManage/getPhone'
  return createRequest(q, options)
}

// 删除客服
export function delCustomer(options: any) {
  const { id } = options
  const s = 'commSetting/deleteCustomerService' + `?id=${id}`
  return createRequest(s, options)
}

// 修改客服
export function modifyCusServer(options: any) {
  const x = 'commSetting/updateCustomerService'
  return createRequest(x, options)
}

// 添加客服
export function addCusServer(options: any) {
  const a = 'commSetting/addCustomerService'
  return createRequest(a, options)
}

// 修改提现卡用户内容
export function modifyCardInfo(optinos: any) {
  const { id, name, identityCard } = optinos
  const p = `?id=${id}&name=${name}&identityCard=${identityCard}`
  const m = 'fundManage/updateAccount' + p
  return createRequest(m, optinos)
}

// 删除提现卡账户
export function deleteCard(options: any) {
  const c = 'fundManage/deleteVerifier';
  const p = `?id=${options.id}`;
  return createRequest(c + p, options)
}

// 资金明细统计
export function fundsTotal(options: any) {
  const { distributionId } = options
  const f = 'order/countOrderRecord' + `?distributionId=${distributionId}`
  return createRequest(f, options)
}

// 发送验证码
export function sendVliCode(options: any) {
  const s = 'fundManage/withdraw/sendcode'
  return createRequest(s, options)
}
