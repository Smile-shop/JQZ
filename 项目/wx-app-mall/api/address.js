import { http } from "../utils/http";
import { origin } from "../utils/env";
import { Ajax } from '../utils/ajax'

// 请求
const ajax = new Ajax()

export async function getCityData(body) {
  return await http({
    methos: 'GET',
    url: body.url,
  });
}

// 查询会员收货地址表
export async function queryShipAddress(body) {
  const url = '/emp-mall/member/addressFront/queryAddressList'
  return await ajax.post(url, body)
}

// 增加会员收货地址表
export async function addShipAddress(body) {
  const url = '/emp-mall/member/addressFront/addAddress'
  return await ajax.post(url, body)
}

// 删除会员收货地址表
export async function deleteShipAddress(body) {
  const url = '/emp-mall/member/addressFront/deleteAddress'
  return await ajax.post(url, body)
}

// 根据ID获取会员收货地址表
export async function queryShipAddressId(body) {
  const url = '/emp-mall/member/addressFront/getAddressById'
  return await ajax.post(url, body)
}

// 分页查询会员收货地址表
export async function queryShipAddressPage(body) {
  const url = '/emp-mall/member/addressFront/queryAddressPage'
  return await ajax.post(url, body)
}

// 修改会员收货地址表
export async function updateShipAddress(body) {
  const url = '/emp-mall/member/addressFront/updateAddress'
  return await ajax.post(url, body)
}