import request from '@/utils/request'
import { jopWXBaseUrl } from '@/api/pro-config'

// 查询电子质保单时间
export function getConsumeTime() {
  return request({
    url: `${jopWXBaseUrl}/extra/query`,
    method: `POST`,
    data: {}
  })
}

// 保存电子质保单时间
export function setConsumeTime(data: any) {
  return request({
    url: `${jopWXBaseUrl}/extra/update`,
    method: `POST`,
    data
  })
}

// 查询电子质保单设置
export function getConsumeNumber() {
  return request({
    url: `${jopWXBaseUrl}/integral/companyInfo`,
    method: `POST`,
    data: {}
  })
}

// 保存电子质保单设置
export function setConsumeNumber(data: any) {
  return request({
    url: `${jopWXBaseUrl}/integral/syncSettings`,
    method: `POST`,
    data
  })
}
