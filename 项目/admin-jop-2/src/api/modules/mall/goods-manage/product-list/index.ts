import http from '@/utils/http';

// 增加零售商城商品表
export async function addSpuFirst(body: any) {
  return http('/emp-mall/retail/spu/addSpuFirst', {
    body,
    method: 'POST',
  });
}
// 移除商品
export async function delSpu(body: any) {
  return http('/emp-mall/retail/spu/delSpu', {
    body,
    method: 'POST',
  });
}
// 根据ID获取零售商城商品表
export async function getSpuById(body: any) {
  return http('/emp-mall/retail/spu/getSpuById', {
    body,
    method: 'POST',
  });
}
// 根据SpuId获取商品详情
export async function getSpuDescription(body: any) {
  return http('/emp-mall/retail/spu/getSpuDescription', {
    body,
    method: 'POST',
  });
}
// 分页查询零售商城商品表
export async function querySpuPage(body: any) {
  return http('/emp-mall/retail/spu/querySpuPage', {
    body,
    method: 'POST',
  });
}
// 商品从回收站恢复到待上架
export async function updateMoveSpuWaitShelf(body: any) {
  return http('/emp-mall/retail/spu/updateMoveSpuWaitShelf', {
    body,
    method: 'POST',
  });
}
// 修改零售商城商品表（上架第一步）
export async function updateSpu(body: any) {
  return http('/emp-mall/retail/spu/updateSpu', {
    body,
    method: 'POST',
  });
}
// 设置商品详情（上架第三步）
export async function updateSpuDescription(body: any) {
  return http('/emp-mall/retail/spu/updateSpuDescription', {
    body,
    method: 'POST',
  });
}
// 商品下架
export async function updateSpuDownShelf(body: any) {
  return http('/emp-mall/retail/spu/updateSpuDownShelf', {
    body,
    method: 'POST',
  });
}
// 商品移至回收站
export async function updateSpuMoveRecycle(body: any) {
  return http('/emp-mall/retail/spu/updateSpuMoveRecycle', {
    body,
    method: 'POST',
  });
}
// 商品上架
export async function updateSpuShelf(body: any) {
  return http('/emp-mall/retail/spu/updateSpuShelf', {
    body,
    method: 'POST',
  });
}
// 查询各个状态的总记录数
export async function queryStatusCount(body: any) {
  return http('/emp-mall/retail/spu/queryStatusCount', {
    body,
    method: 'POST',
  });
}
// 增加或修改商品SKU（第二步）
export async function addOrUpdateSku(body: any) {
  return http('/emp-mall/retail/sku/addOrUpdateSku', {
    body,
    method: 'POST',
  });
}
// 增加零售商城商品图片(上架第二步)
export async function addOrUpdateImg(body: any) {
  return http('/emp-mall/retail/sku/addOrUpdateImg', {
    body,
    method: 'POST',
  });
}

// 根据ID获取商品SKU
export async function getSkuById(body: any) {
  return http('/emp-mall/retail/sku/getSkuById', {
    body,
    method: 'POST',
  });
}
// 根据SkuID获取sku商品详情
export async function getSkuGoodsBySkuId(body: any) {
  return http('/emp-mall/retail/sku/getSkuGoodsBySkuId', {
    body,
    method: 'POST',
  });
}
// 根据SpuID获取商品SKU详细信息
export async function getSpuSkuBySpuId(body: any) {
  return http('/emp-mall/retail/sku/getSpuSkuBySpuId', {
    body,
    method: 'POST',
  });
}
// 根据SkuId判断Sku能否删除
export async function isCandelSkuByIds(body: any) {
  return http('/emp-mall/retail/sku/isCandelSkuByIds', {
    body,
    method: 'POST',
  });
}
// 分页查询商品SKU
export async function querySkuPage(body: any) {
  return http('/emp-mall/retail/sku/querySkuPage', {
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
// 查询所有的推荐位信息
export async function queryAllRecommandationList(body: any) {
  return http('/emp-mall/banner/recommandation/queryAllRecommandationList', {
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
// 根据ID获取商品关联
export async function getSkuGoodsById(body: any) {
  return http('/emp-mall/retail/skuGoods/getSkuGoodsById', {
    body,
    method: 'POST',
  });
}
// 根据SpuID进入查询货品页面初始化数据
export async function queryGoodsInitDataIndex(body: any) {
  return http('/emp-mall/retail/skuGoods/queryGoodsInitDataIndex', {
    body,
    method: 'POST',
  });
}
// 分页查询货品列表
export async function queryGoodsPage(body: any) {
  return http('/emp-mall/retail/skuGoods/queryGoodsPage', {
    body,
    method: 'POST',
  });
}
// 根据ID获取商品关联分页
export async function querySkuGoodsPage(body: any) {
  return http('/emp-mall/retail/skuGoods/querySkuGoodsPage', {
    body,
    method: 'POST',
  });
}
// 修改Sku规格
export async function updateSkus(body: any) {
  return http('/emp-mall/retail/sku/updateSkus', {
    body,
    method: 'POST',
  });
}
// 增加货品绑定关系
export async function addSkuGoods(body: any) {
  return http('/emp-mall/retail/skuGoods/addSkuGoods', {
    body,
    method: 'POST',
  });
}
// 根据id删除关联关系
export async function delSkuGoodsByIds(body: any) {
  return http('/emp-mall/retail/skuGoods/delSkuGoodsByIds', {
    body,
    method: 'POST',
  });
}
