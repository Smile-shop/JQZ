import {postRequestInit, getRequestInit} from './common/request-init';
import {HttpReq} from '@/typings/utils';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';

const BASE_URL: string = VUE_APP_BASE_URL;

// 商品添加进购物车
export const addToShoppingCartReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/shoppingCart/update'),
  requestInit: postRequestInit,
};

// 商品批量添加进购物车
export const batchAddToShoppingCartReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/shoppingCart/batchUpdate'),
  requestInit: postRequestInit,
};

// 购物车信息
export const shoppingCartInfoReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/shoppingCart/info'),
  requestInit: postRequestInit,
};

// 删除购物车产品
export const deleteShoppingCartProductReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/shoppingCart/remove'),
  requestInit: postRequestInit,
};

// 购物车商品数
export const shoppingCartCountReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/shoppingCart/count'),
  requestInit: postRequestInit,
};

// 批量查询产品信息
export const productBatchSelectReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/shoppingCart'),
  requestInit: postRequestInit,
};
