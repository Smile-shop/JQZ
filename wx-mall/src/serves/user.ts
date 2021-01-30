import {postRequestInit, getRequestInit} from './common/request-init';
import {HttpReq} from '@/typings/utils';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';

const BASE_URL: string = VUE_APP_BASE_URL;

// 获取企业ftp用户名
export const folderNameReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/ftp/openapi/findFolderName'),
  requestInit: postRequestInit,
};

// 个人信息
export const userInfoReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxMember/wxMemberIndex'),
  requestInit: postRequestInit,
};

// 个人信息完善
export const userInfoCompleteReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxMemberInfo/wxMemberUpdate'),
  requestInit: postRequestInit,
};

// 积分记录
export const pointHistoryReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxCredit/wxCreditInfo'),
  requestInit: postRequestInit,
};

// 收藏列表
export const collectListReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/collection/listByPage'),
  requestInit: postRequestInit,
};

// 删除收藏
export const collectDeleteReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/collection/deleteOne'),
  requestInit: postRequestInit,
};

// 删除全部收藏
export const collectDeleteAllReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/collection/deleteAll'),
  requestInit: postRequestInit,
};

// 添加收藏
export const collectAddReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/shop-web/mall/collection/collect'),
  requestInit: postRequestInit,
};

// 添加收货地址
export const addressAddReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/integral/add_address'),
  requestInit: postRequestInit,
};

// 更新收货地址
export const addressUpdateReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/integral/update_address'),
  requestInit: postRequestInit,
};

// 收货地址列表
export const addressListReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/integral/member_address'),
  requestInit: postRequestInit,
};

// 收货地址删除
export const addressDeleteReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/integral/remove_address'),
  requestInit: postRequestInit,
};

// 查询交易规则
export const selectSellRulesReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-wx-web/declare/look'),
  requestInit: postRequestInit,
};
