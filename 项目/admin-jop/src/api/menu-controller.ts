import request from '@/utils/request'
import { jopAdminBaseUrl, jopWXBaseUrl, jopWebBaseUrl, jopCustomerBaseUrl } from '@/api/pro-config'

// 登录
export function loginMethod(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/login`,
    method: `POST`,
    data,
  })
}

// 验证companyKey
export function validateCompanyKey(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/checkCompanyKey`,
    method: `POST`,
    data,
  })
}

// 发送短信
export function sendPhoneMsg(data: any, headers: any) {
  return request({
    url: `${jopWXBaseUrl}/commonSms/noValidate/sendNoValidate`,
    method: `POST`,
    data,
    headers
  })
}

// 重置密码
export function resetPsd(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/resetMainAccountPwd`,
    method: `POST`,
    data,
  })
}

// 登出
export function logoutMethod(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/loginOut`,
    method: `POST`,
    data,
  })
}

// 查询模块
export function getPageAppPermission(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/appMenu/getFirstPageAppPermission`,
    method: `POST`,
    data,
  })
}

// 查询菜单列表
export function getLoginAccountMenuList(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/appMenu/getLoginAccountMenuList`,
    method: `POST`,
    data,
  })
}

// 绑定JMP用户
export function JMPBingMethod(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/bindJmpAccount`,
    method: `POST`,
    data,
  })
}

// 解绑JMP
export function cancelJMPBingMethod(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/unbindJmpAccount`,
    method: `POST`,
    data,
  })
}

// 其他权限控制
export function getOtherPermissions(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/otherPermission/getOtherPermissions`,
    method: `POST`,
    data,
  })
}


// 账户信息
export function getAccountInfo(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/getAccountInfo`,
    method: `POST`,
    data,
  })
}