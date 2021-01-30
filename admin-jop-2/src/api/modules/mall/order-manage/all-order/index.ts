import http from '@/utils/http';
// 审核
export async function audit(body: any) {
  return http('/emp-mall/order/audit', {
    body,
    method: 'POST',
  });
}
// 取消审核
export async function cancelAudit(body: any) {
  return http('/emp-mall/order/cancelAudit', {
    body,
    method: 'POST',
  });
}
// 取消确认
export async function cancelConfirm(body: any) {
  return http('/emp-mall/order/cancelConfirm', {
    body,
    method: 'POST',
  });
}
// 关闭订单
export async function cancelOrder(body: any) {
  return http('/emp-mall/order/cancelOrder', {
    body,
    method: 'POST',
  });
}
// 取消备货
export async function cancelStockup(body: any) {
  return http('/emp-mall/order/cancelStockup', {
    body,
    method: 'POST',
  });
}
// 确认订单
export async function confirm(body: any) {
  return http('/emp-mall/order/confirm', {
    body,
    method: 'POST',
  });
}
// 确认收货
export async function finish(body: any) {
  return http('/emp-mall/order/finish', {
    body,
    method: 'POST',
  });
}
// 订单列表
export async function queryOrderPage(body: any) {
  return http('/emp-mall/order/queryOrderPage', {
    body,
    method: 'POST',
  });
}
// 订单时间类型选择
export async function querySelectOrderDate(body: any) {
  return http('/emp-mall/order/querySelectOrderDate', {
    body,
    method: 'POST',
  });
}
// 订单字段选择
export async function querySelectOrderField(body: any) {
  return http('/emp-mall/order/querySelectOrderField', {
    body,
    method: 'POST',
  });
}
// 发货
export async function shipped(body: any) {
  return http('/emp-mall/order/shipped', {
    body,
    method: 'POST',
  });
}
// 确认备货
export async function stockup(body: any) {
  return http('/emp-mall/order/stockup', {
    body,
    method: 'POST',
  });
}
// 付款订单直接发货
export async function directShipped(body: any) {
  return http('/emp-mall/order/directShipped', {
    body,
    method: 'POST',
  });
}
// 门店下拉
export async function querySelectRecMethod(body: any) {
  return http('/emp-mall/store/querySelectRecMethod', {
    body,
    method: 'POST',
  });
}
// 订单详情
export async function getDisplayByOrderId(body: any) {
  return http('/emp-mall/order/orderDetail/getDisplayByOrderId', {
    body,
    method: 'POST',
  });
}
// 根据订单ID获取订单备货列表
export async function getStockupByOrderId(body: any) {
  return http('/emp-mall/order/orderDetail/getStockupByOrderId', {
    body,
    method: 'POST',
  });
}
// 查询sku关联的货品信息列表
export async function querySkuGoodsStock(body: any) {
  return http('/emp-mall/order/orderDetail/querySkuGoodsStock', {
    body,
    method: 'POST',
  });
}
// 获取订单设置信息
export async function getOrderSetInfo(body: any) {
  return http('/emp-mall/order/set/getOrderSetInfo', {
    body,
    method: 'POST',
  });
}
// 订单设置
export async function saveOrderSetInfo(body: any) {
  return http('/emp-mall/order/set/saveOrderSetInfo', {
    body,
    method: 'POST',
  });
}
// 订单恢复默认设置
export async function resetOrderSetInfo(body: any) {
  return http('/emp-mall/order/set/resetOrderSetInfo', {
    body,
    method: 'POST',
  });
}
