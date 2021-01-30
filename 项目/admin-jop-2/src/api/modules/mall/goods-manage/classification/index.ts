import http from '@/utils/http';

// 分页查询商品分类
export async function queryRetailCategoryPage(body: any) {
  return http('/emp-mall/category/retailCategory/queryRetailCategoryPage', {
    body,
    method: 'POST',
  });
}
// 根据分类级别查询商品分类
export async function queryRetailCategoryList(body: any) {
  return http('/emp-mall/category/retailCategory/queryRetailCategoryList', {
    body,
    method: 'POST',
  });
}
// 增加商品分类
export async function addRetailCategory(body: any) {
  return http('/emp-mall/category/retailCategory/addRetailCategory', {
    body,
    method: 'POST',
  });
}
// 根据ID批量删除商品分类
export async function delRetailCategoryByIds(body: any) {
  return http('/emp-mall/category/retailCategory/delRetailCategoryByIds', {
    body,
    method: 'POST',
  });
}
// 根据ID删除商品属性排序
export async function delRetailCategoryProperty(body: any) {
  return http('/emp-mall/category/retailCategory/delRetailCategoryProperty', {
    body,
    method: 'POST',
  });
}
// 根据ID获取商品分类
export async function getRetailCategoryById(body: any) {
  return http('/emp-mall/category/retailCategory/getRetailCategoryById', {
    body,
    method: 'POST',
  });
}
// 修改商品分类
export async function updateRetailCategory(body: any) {
  return http('/emp-mall/category/retailCategory/updateRetailCategory', {
    body,
    method: 'POST',
  });
}
// 修改商品分类排序
export async function updateRetailCategorySort(body: any) {
  return http('/emp-mall/category/retailCategory/updateRetailCategorySort', {
    body,
    method: 'POST',
  });
}
// 批量修改商品分类是否用于分类筛选条件
export async function updateRetailCategoryVisible(body: any) {
  return http('/emp-mall/category/retailCategory/updateRetailCategoryVisible', {
    body,
    method: 'POST',
  });
}
// 查询货品属性
export async function queryGoodPropList(body: any) {
  return http('/emp-mall/category/retailCategory/queryGoodPropList', {
    body,
    method: 'POST',
  });
}
