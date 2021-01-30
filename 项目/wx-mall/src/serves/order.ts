import {postRequestInit, getRequestInit, postFileRequestInit} from './common/request-init';
import {HttpReq} from '@/typings/utils';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';

const BASE_URL: string = VUE_APP_BASE_URL;

// 门店列表
export const shopListReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/shopinfo'),
  requestInit: postRequestInit,
};

// 新建订单
export const orderCreateReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/order/create'),
  requestInit: postRequestInit,
};

// 支付订单
export const orderPayReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/order/lockOrder'),
  requestInit: postRequestInit,
};

// 订单列表
export const orderListReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/order/mylist'),
  requestInit: postRequestInit,
};

// 删除订单
export const orderDeleteReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/order/delete'),
  requestInit: postRequestInit,
};

// 订单详情
export const orderDetailReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/order/detail'),
  requestInit: postRequestInit,
};

// 商品评价
export const productRemarkReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/evaluate/evaluate'),
  requestInit: postRequestInit,
};

// 商品评价列表
export const productRemarkListReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/evaluate/evaluateList'),
  requestInit: postRequestInit,
};

// 确认收货
export const orderConfirmReceiptReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/order/confirmReceipt'),
  requestInit: postRequestInit,
};

// 申请退款
export const orderRefundReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/order/refund'),
  requestInit: postRequestInit,
};

// 上传图片
export const uploadIMGReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/file/upload'),
  requestInit: postFileRequestInit,
};

// 订单各状态数量
export const orderStatusCountReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/order/statusCount'),
  requestInit: postRequestInit,
};
