import { Ajax } from '../utils/ajax'

// 统一添加请求方法
const ajax = new Ajax()

// 查询商品类型
export async function queryGoodList(body) {
  const url = '/emp-mall/categoryFront/queryCategoryLevelOneAndTwoList'
  return await ajax.post(url, body)
}