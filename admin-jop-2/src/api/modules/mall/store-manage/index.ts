import http from '@/utils/http';

// 分页查询零售商城门店和分销商
export async function queryWithDistPage(body: any) {
  return http('/emp-mall/store/queryWithImgDistPage', {
    body,
    method: 'POST',
  });
}

// 根据分销商ID查询零售商城门店和分销商
export async function queryWithDisByDistId(body: any) {
  return http('/emp-mall/store/queryWithImgDistByDistId', {
    body,
    method: 'POST',
  });
}

// 根据分销商ID修改零售商城门店
export async function updateByDisId(body: any) {
  return http('/emp-mall/store/updateByDisId', {
    body,
    method: 'POST',
  });
}

// 根据门店ID查询零售商城参数
export async function querByStoId(body: any) {
  return http('/emp-mall/store/storeParameter/querByStoId', {
    body,
    method: 'POST',
  });
}

// 修改零售商城门店参数
export async function updateStoreParameter(body: any) {
  return http('/emp-mall/store/storeParameter/updateStoreParameter', {
    body,
    method: 'POST',
  });
}

// 根据门店ID修改零售商城参数
export async function updateByStoId(body: any) {
  return http('/emp-mall/store/storeParameter/updateByStoId', {
    body,
    method: 'POST',
  });
}

// 根据门店ID修改零售商城参数
export async function queryParameterList(body: any) {
  return http('/emp-mall/store/parameter/queryParameterList', {
    body,
    method: 'POST',
  });
}

// 根据门店ID修改零售商城参数
export async function queryStoreList(body: any) {
  return http('/emp-mall/store/queryStoreList', {
    body,
    method: 'POST',
  });
}

// 修改商城参数
export async function updateParameter(body: any) {
  return http('/emp-mall/store/parameter/updateParameter', {
    body,
    method: 'POST',
  });
}
