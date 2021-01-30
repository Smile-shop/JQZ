import { Ajax } from '../utils/ajax'

// 统一添加请求方法
const ajax = new Ajax()

// 查询会员默认收货地址表
export async function queryDefaultAddress(body) {
  const url = '/emp-mall/member/addressFront/queryDefaultAddress'
  return await ajax.post(url, body)
}

// 购物车提交订单
export async function addOrderByCart(body) {
  const url = '/emp-mall/usr/order/orderFront/addOrderByCart'
  return await ajax.post(url, body)
}

// 详情直接订单
export async function addOrder(body) {
  const url = '/emp-mall/usr/order/orderFront/addOrder'
  return await ajax.post(url, body)
}

// 获取收货方式
export async function querByStoId(body) {
  const url = '/emp-mall/store/storeParameter/querByStoId'
  return await ajax.post(url, body)
}

