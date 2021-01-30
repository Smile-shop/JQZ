import request from '@/utils/request'
import { jopWXBaseUrl } from '@/api/pro-config'

// 查询app样式
export function getAppStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/productVerify/queryPage`,
    method: `POST`,
    data,
  })
}

// 设置app样式
export function setAppStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/productVerify/save`,
    method: `POST`,
    data,
  })
}

// 查询设置微证书参数
export function getCredentialParams(data: any) {
  return request({
    url: `${jopWXBaseUrl}/productVerify/query`,
    method: `POST`,
    data,
    headers: {
      appCode: `productCheck`
    }
  })
}

// 更新设置微证书参数
export function setCredentialParams(data: any) {
  return request({
    url: `${jopWXBaseUrl}/productVerify/update`,
    method: `POST`,
    data,
    headers: {
      appCode: `productCheck`
    }
  })
}

// 微证书查询显示信息
export function getCredentialShowInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/productVerify/categoryInfo`,
    method: `POST`,
    data,
  })
}

// 微证书设置显示信息
export function setCredentialShowInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/productVerify/update_categoryInfo`,
    method: `POST`,
    data,
  })
}

// 微证书查询已选择的首饰大类
export function getSelectedJewelryGenera(data: any) {
  return request({
    url: `${jopWXBaseUrl}/productVerify/category`,
    method: `POST`,
    data,
  })
}
