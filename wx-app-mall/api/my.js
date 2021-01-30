import { Ajax } from '../utils/ajax'

const ajax = new Ajax()

// 获取营销统计信息
export async function getMarketingCount(body) {
  const url = '/emp-mall/wxMemberFront/queryMarketNumInfoByMid'
  return await ajax.post(url, body)
}

// 获取订单统计信息
export async function getOrderCount(body) {
  const url = '/emp-mall/wxMemberFront/queryOrderNumInfoByMid'
  return await ajax.post(url, body)
}

// 解除绑定会员
export async function untieUser(body) {
  const url = '/emp-mall/wxMemberFront/unbindMemberInfo'
  return await ajax.post(url, body)
}
