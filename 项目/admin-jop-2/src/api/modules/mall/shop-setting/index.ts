import http from '@/utils/http';

// 设置分类导航
export async function addOrUpdateCateNavigation(body: any) {
  return http('/emp-mall/banner/homeNavigation/addOrUpdateCateNavigation', {
    body,
    method: 'POST',
  });
}

// 设置轮播图
export async function addOrUpdateIndexNavigation(body: any) {
  return http('/emp-mall/banner/homeNavigation/addOrUpdateIndexNavigation', {
    body,
    method: 'POST',
  });
}

// 根据Id删除轮播图或者分类导航
export async function delHomeNavigationByIds(body: any) {
  return http('/emp-mall/banner/homeNavigation/delHomeNavigationByIds', {
    body,
    method: 'POST',
  });
}

// 查询分类导航列表
export async function queryHomeCateNavigationList(body: any) {
  return http('/emp-mall/banner/homeNavigation/queryHomeCateNavigationList', {
    body,
    method: 'POST',
  });
}

// 查询轮播图列表
export async function queryIndexNavigationList(body: any) {
  return http('/emp-mall/banner/homeNavigation/queryIndexNavigationList', {
    body,
    method: 'POST',
  });
}

// 查询一级分类(包含二级分类)
export async function queryCategoryLevelOneAndTwoList(body: any) {
  return http('/emp-mall/categoryFront/queryCategoryLevelOneAndTwoList', {
    body,
    method: 'POST',
  });
}

// 查询一级分类
export async function queryCategoryLevelOneList(body: any) {
  return http('/emp-mall/categoryFront/queryCategoryLevelOneList', {
    body,
    method: 'POST',
  });
}

// 增加推荐位商品
export async function addSpuRecommandation(body: any) {
  return http('/emp-mall/banner/recommandation/addSpuRecommandation', {
    body,
    method: 'POST',
  });
}

// 根据ID批量删除推荐位商品表
export async function delSpuRecommandationById(body: any) {
  return http('/emp-mall/banner/recommandation/delSpuRecommandationById', {
    body,
    method: 'POST',
  });
}

// 查询推荐位信息
export async function getRecommandationByKind(body: any) {
  return http('/emp-mall/banner/recommandation/getRecommandationByKind', {
    body,
    method: 'POST',
  });
}

// 查询所有的推荐位信息
export async function queryAllRecommandationList(body: any) {
  return http('/emp-mall/banner/recommandation/queryAllRecommandationList', {
    body,
    method: 'POST',
  });
}

// 推荐位分页查询商品
export async function querySpuPageByRecommandation(body: any) {
  return http('/emp-mall/banner/recommandation/querySpuPageByRecommandation', {
    body,
    method: 'POST',
  });
}

// 分页查询推荐位商品列表
export async function querySpuRecommandationPage(body: any) {
  return http('/emp-mall/banner/recommandation/querySpuRecommandationPage', {
    body,
    method: 'POST',
  });
}

// 修改推荐位表
export async function updateRecommandation(body: any) {
  return http('/emp-mall/banner/recommandation/updateRecommandation', {
    body,
    method: 'POST',
  });
}
