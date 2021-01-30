import {postRequestInit, getRequestInit} from './common/request-init';
import {HttpReq} from '@/typings/utils';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';

const BASE_URL: string = VUE_APP_BASE_URL;

// 首页
export const HomeInfoReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/home'),
  requestInit: postRequestInit,
};

// 页面样式
export const pageStyle: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-wx-web/wxShop/findShopParams'),
  requestInit: postRequestInit,
};

// 高级查询选择项
export const searchTypeReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/queryCommonCategory'),
  requestInit: postRequestInit,
};

// 商品列表查询
export const productSearchReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/productList'),
  requestInit: postRequestInit,
};

// 商品信息查询
export const productInfoReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/productinfo'),
  requestInit: postRequestInit,
};

// 商品详细信息查询
export const productDetailInfoReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/detail'),
  requestInit: postRequestInit,
};

// 查询title
export const projectTitleReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-wx-web/wxShop/queryWscTititle'),
  requestInit: postRequestInit,
};

// 生成海报
export const builderWaresQrcodeReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/postPoster'),
  requestInit: postRequestInit,
};

// get形式生成海报
export const getPosterReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/getPoster'),
  requestInit: postRequestInit,
};

// 获取公众号id
export const getWxComInfoReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/wxmallExtend/getWxComInfo'),
  requestInit: postRequestInit,
};

// 获取分享样式
export const getProductShareStyleReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-wx-web/wxMallSetting/queryProductShareStyle'),
  requestInit: postRequestInit,
};

// 获取列表参数
export const getListDisplayParamsReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/queryDisplayParamsByCategory'),
  requestInit: postRequestInit,
};

// 获取配送方式
export const getMailingMethodReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-wx-web/wxMallSetting/queryMailingMethod'),
  requestInit: postRequestInit,
};
