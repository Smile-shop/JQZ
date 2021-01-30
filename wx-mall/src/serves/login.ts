import {postRequestInit, getRequestInit} from './common/request-init';
import {HttpReq} from '@/typings/utils';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';


const BASE_URL: string = VUE_APP_BASE_URL;

// 可用登录类型
export const loginTypeUsableReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxBind/wxLoginIndex'),
  requestInit: postRequestInit,
};

// 登录
export const loginReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxBind/wxLogin'),
  requestInit: postRequestInit,
};

// 注册字段
export const registerFieldReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxBind/wxRegistIndexNew'),
  requestInit: postRequestInit,
};

// 根据门店查询店员
export const shopAssistantReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxBind/qrySaler'),
  requestInit: postRequestInit,
};

// 注册
export const registerReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxBind/wxRegist'),
  requestInit: postRequestInit,
};

// 手机验证码
export const verificationCodePhoneReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxCode/sendPhoneMsg'),
  requestInit: postRequestInit,
};

// 忘记密码
export const passwordForgetReq: HttpReq.ReqOptions = {
  url: BASE_URL.concat('/jop-web/wxMemberInfo/wxPwdUpdate'),
  requestInit: postRequestInit,
};

// 图形验证码
export const verificationCodeReqUrlPic: string = BASE_URL.concat('/jop-web/wxCode/randanCode');
