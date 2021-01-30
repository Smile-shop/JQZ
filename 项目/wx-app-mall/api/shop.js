import { Ajax } from '../utils/ajax'
// 统一添加请求方法
const ajax = new Ajax()

// 根据门店ID单个查询零售商城门店
export async function queryAddressById(id) {
  return await ajax.post(`/emp-mall/storeFront/queryWithImgDistanById`, id)
}