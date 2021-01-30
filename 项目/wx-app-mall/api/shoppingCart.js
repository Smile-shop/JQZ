import { Ajax } from '../utils/ajax'
// 统一添加请求方法
const ajax = new Ajax()

// 查询购物车列表
export async function queryShoppingCart(data) {
  return await ajax.post( `/emp-mall/usr/order/shoppingCartFront/queryShoppingCart`, data );
}

// 批量删除零售商城购物车商品
export async function delBatchShoppingCart(data) {
  return await ajax.post( `/emp-mall/usr/order/shoppingCartFront/delBatchShoppingCart`, data );
}

// 修改零售商城购物车商品
export async function updateShoppingCart(data) {
  return await ajax.post( `/emp-mall/usr/order/shoppingCartFront/updateShoppingCart`, data );
}
