import request from '@/utils/request'
import { wholesaleBaseUrl } from '@/api/pro-config'

import { unCompileStrFunction } from '@/utils/storeageCompile'

export function user() {
  const userStr = window.sessionStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(unCompileStrFunction(userStr));
    return user.account.accountName;
  }
  return null;
}


export function getOnlineClassify(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/classified/list`,
    method: 'POST',
    data
  })
}

export function submit(data: any): any {
  const options = data
  options.updateBy = user()
  return request({
    url: `${wholesaleBaseUrl}/manager/classified/updateClassified`,
    method: 'POST',
    data
  })
}

export function addSubmit(data: any): any {
  const options = data
  options.updateBy = user()
  return request({
    url: `${wholesaleBaseUrl}/manager/classified/addClassified`,
    method: 'POST',
    data
  })
}

export function deleteOnline(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/classified/delClassified`,
    method: 'POST',
    data
  })
}