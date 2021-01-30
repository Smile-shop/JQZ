import request from '@/utils/request'
import { wholesaleBaseUrl, jopWXBaseUrl } from '@/api/pro-config'

// 批量添加商品到待上架
export function getBatchAddWait(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/batchAddWait`,
    method: 'POST',
    data,
  })
}

// 批量移除
export function getBatchDel(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/batchDel`,
    method: 'POST',
    data,
  })
}

// 批量自动上架同款商品关闭或者开启
export function getBatchUpdateEqual(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/batchUpdateEqual`,
    method: 'POST',
    data,
  })
}

// 批量热门分类修改
export function getBatchUpdateOnlineType(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/batchUpdateOnlineType`,
    method: 'POST',
    data,
  })
}

// 批量选择推荐位修改
export function getBatchUpdatePresenter(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/batchUpdatePresenter`,
    method: 'POST',
    data,
  })
}

// 批量设置价格倍率
export function getBatchUpdatePriceRatio(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/batchUpdatePriceRatio`,
    method: 'POST',
    data,
  })
}

// 批量上架
export function getBatchUpdateUp(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/batchUpdateUp`,
    method: 'POST',
    data,
  })
}

// 批量0库存关闭或者开启
export function getBatchUpdateZero(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/batchUpdateZero`,
    method: 'POST',
    data,
  })
}

// 上架列表条件查询
export function getFindProduct(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/findProducts`,
    method: 'POST',
    data,
  })
}


// 上架查询JMP商品图片
export function getPhotosByCode(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/getPhotosByCode`,
    method: 'POST',
    data,
  })
}

// 饰品首饰仓库条件查询
export function getFindStockProduts(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/findStockProduts`,
    method: 'POST',
    data,
  })
}

// 商品详情查询
export function getProductDetail(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/productDetail`,
    method: 'POST',
    data,
  })
}
// 商品详情2（子商品列表分页查询）
export function getProductSubDetail(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/productSubDetail`,
    method: 'POST',
    data,
  })
}

// 热门分类结果集查询
export function getSelectOnLineCategorys(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/classified/list`,
    method: 'POST',
    data,
  })
}

// 推荐位名称结果集查询
export function getSelectPresenters(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/queryClassifiedRecommend`,
    method: 'POST',
    data,
  })
}

// 查询柜组
export function listCabinetGroup(data: any) {
  return request({
    url: `${jopWXBaseUrl}/cabinetOrder/listCabinetGroup`,
    method: 'POST',
    data,
  })
}

// 上架状态数量查询
export function getSelectShelvesStatusNum() {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/selectShelvesStatusNum`,
    method: 'POST',
    data: {},
  })
}

// 上架状态数量查询
export function queryRecommendPosition() {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/queryRecommendPosition`,
    method: 'POST',
    data: {},
  })
}

// 商品详情2子商品上架状态修改
export function updateSubProStatus(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/updateSubProStatus`,
    method: 'POST',
    data,
  })
}


// 商品详情3文本保存
export function updateProDetailText(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/updateProDetailText`,
    method: 'POST',
    data,
  })
}

// 商品详情1图片保存修改 batchAddSubPro
export function updateProDetailImg(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/updateProDetailImg`,
    method: 'POST',
    data,
  })
}

// 批量新增子商品 batchAddSubPro
export function batchAddSubPro(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/batchAddSubPro`,
    method: 'POST',
    data,
  })
}

// 商品详情推荐位修改
export function updateDetailPresenter(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/updateDetailPresenter`,
    method: 'POST',
    data,
  })
}

// 编辑修改名称和倍率
export function updateProNameAndPrice(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/updateProNameAndPrice`,
    method: 'POST',
    data,
  })
}

// 商品详情线上分类修改
export function updateDetailOnlineType(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/updateDetailOnlineType`,
    method: 'POST',
    data,
  })
}

// 子商品批量移除
export function delSubPro(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/proShelves/delSubPro`,
    method: 'POST',
    data,
  })
}