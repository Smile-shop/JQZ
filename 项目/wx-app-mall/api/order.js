import { Ajax } from '../utils/ajax'

// 统一请求方法
const ajax = new Ajax()

// 取消订单根据订单ID
export async function cancelOrder(body) {
  const url = '/emp-mall/usr/order/orderFront/cancelOrder'
  return await ajax.post(url, body)
}

// 删除订单根据订单ID
export async function deleteOrder(body) {
  const url = '/emp-mall/usr/order/orderFront/delOrder'
  return await ajax.post(url, body)
}

// 支付接口
export async function payment(body) {
  const url = '/emp-mall/usr/order/orderFront/payment'
  return await ajax.post(url, body)
}

// 根据订单编号查询详情
export async function queryOrderDetail(body) {
  const url = '/emp-mall/usr/order/orderFront/queryOrderDetailByOrderId'
  return await ajax.post(url, body)
}

// 分页查询我的订单
export async function queryOrderPage(body) {
  const url = '/emp-mall/usr/order/orderFront/queryOrderPage'
  return await ajax.post(url, body)
}

// 确认收货
export async function finish(body) {
  const url = '/emp-mall/usr/order/orderFront/finish'
  return await ajax.post(url, body)
}
