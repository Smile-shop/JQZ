import { Ajax } from '../utils/ajax'

// 统一处理请求方法
const ajax = new Ajax()

// 获取规格库存列表
export async function querySkuStock(body) {
  const url = '/emp-mall/spuFront/getSkuStock'
  return await ajax.post(url, body)
}

// 获取商品信息
export async function queryShopInfo(body) {
  const url = '/emp-mall/spuFront/getSpu'
  return await ajax.post(url, body)
}

// 根据商品 ID 获取商品基本与评论等其他
export async function queryshopAttributes(body) {
  const url = '/emp-mall/spuFront/getSpuDetail'
  return await ajax.post(url, body)
}

// 查询商品列表
export async function queryShopList(body) {
  const url = '/emp-mall/spuFront/querySpuPage'
  return await ajax.post(url, body)
}


// 列表一级导航
export async function levelFirst(body) {
  const url = '/emp-mall/categoryFront/queryCategoryLevelOneList'
  return await ajax.post(url, body)
}

// 查询购物车数量
export async function queryShopCart(body) {
  const url = '/emp-mall/usr/order/shoppingCartFront/getShoppingCartCount'
  return await ajax.post(url, body)
}

// 增加商品到零售商城购物车
export async function addCommdityShopCart(body) {
  const url = '/emp-mall/usr/order/shoppingCartFront/addShoppingCart'
  return await ajax.post(url, body)
}

// 增加订单
export async function buyNow(body) {
  const url = '/emp-mall/usr/order/orderFront/addOrder'
  return await ajax.post(url, body)
}

// sku是否有效验证
export async function checkSku(body) {
  const url = '/emp-mall/spuFront/queryValidateSkuValid'
  return await ajax.post(url, body)
}