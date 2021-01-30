import { Ajax } from '../utils/ajax'

// 统一添加请求方法
const ajax = new Ajax()

// 查询轮播图列表
export async function getSwipersData(data) {
  return await ajax.post(`/emp-mall/banner/homeNavigationFront/queryIndexNavigationList`, data);
}

// 查询分类导航列表
export async function queryIndexCateNavigationList(data) {
  return await ajax.post(`/emp-mall/banner/homeNavigationFront/queryIndexCateNavigationList`, data);
}

// 获取单个推荐位商品列表
export async function queryIndexSpuRecommandList(data) {
  return await ajax.post(`/emp-mall/banner/homeNavigationFront/queryIndexSpuRecommandList`, data);
}

// 获取所有推荐位商品列表
export async function queryAllIndexSpuRecommandList(data) {
  return await ajax.post(`/emp-mall/banner/homeNavigationFront/queryAllIndexSpuRecommandList`, data);
}

// 查询是否是门店优先
export async function queryIsDistanByFirst(data) {
  return await ajax.post(`/emp-mall/storeFront/queryIsDistanByFirst`, data);
}

// 根据距离分页查询零售商城门店
export async function queryWithImgDistancePage(data) {
  return await ajax.post(`/emp-mall/storeFront/queryWithImgDistancePage`, data);
}

// 查询是否是距离优先
export async function queryWithImgDistanByFirst(data) {
  return await ajax.post(`/emp-mall/storeFront/queryWithImgDistanByFirst`, data);
}

// 根据门店ID单个查询零售商城门店
export async function queryWithImgDistanById(data) {
  return await ajax.post(`/emp-mall/storeFront/queryWithImgDistanById`, data);
}
