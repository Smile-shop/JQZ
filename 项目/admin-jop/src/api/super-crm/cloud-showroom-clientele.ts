import request from '@/utils/request'
import { wholesaleBaseUrl } from '@/api/pro-config'

// 添加客户主账号
export function getCustomerAdd(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/customer/add`,
    method: 'POST',
    data,
  })
}

// 编辑/分配客户主账号
export function getCustomerEdit(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/customer/edit`,
    method: 'POST',
    data,
  })
}

// 客户列表接口
export function getCustomerList(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/customer/list`,
    method: 'POST',
    data,
  })
}

// 搜索客户接口
export function getCustomerQuery(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/customer/query`,
    method: 'POST',
    data,
  })
}

// 地区
export function getQueryAddress() {
  return request({
    url: `${wholesaleBaseUrl}/manager/common/queryAddress`,
    method: 'POST',
    data: {},
  })
}

// 设置按钮
export function setUserAuth(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/customer/SaveCustomerManagerSetting`,
    method: 'POST',
    data,
  })
}

// 批量设置价格或访问状态
export function batchSetPriceOrStatus(data: any) {
  return request({
    url: `${wholesaleBaseUrl}/manager/customer/batchSetRate`,
    method: 'POST',
    data,
  })
}

// 查询默认设置
export function findDefault() {
  return request({
    url: `${wholesaleBaseUrl}/manager/customer/findCustomerManagerSetting`,
    method: 'POST',
  })
}
