import request from '@/utils/request'
import { jopMiniprogramBaseUrl } from '@/api/pro-config'

import { unCompileStrFunction } from '@/utils/storeageCompile'

// 获取已授权信息
export function getAuthSuccessInfo(data: any) {
  return request({
    url: `${jopMiniprogramBaseUrl}/mini/getAuthorizationMiniInfoList`,
    method: 'POST',
    data,
    headers: {
      token: ''
    }
  })
}

// 查询第三方信息列表
export function getWxThirdPartyInfo() {
  return request({
    url: `${jopMiniprogramBaseUrl}/mini/getThirdInfoList`,
    method: `POST`,
    data: {},
    headers: {
      token: ''
    }
  })
}

// 获取一个 companyKey
export function companyKey() {
  const userStr = window.sessionStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(unCompileStrFunction(userStr));
    return user.account.companyKey;
  }
  return null;
}

// 查询授权成功
export function getAuthSuccess(data: any) {
  return request({
    url: `${jopMiniprogramBaseUrl}/mini/getMiniAuthResult`,
    method: 'POST',
    data,
    headers: {
      token: ''
    }
  })
}
