import request from '@/utils/request'
import { jopAdminBaseUrl, jopWXBaseUrl, jopWebBaseUrl, jopCustomerBaseUrl } from '@/api/pro-config'

// 超级crm统计信息
export function getSuperCrmCountInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryCounts`,
    method: `POST`,
    data,
  })
}

// 查询快捷菜单
export function getShortcutMenu(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryQuickMenu`,
    method: `POST`,
    data,
  })
}

// 设置快捷菜单
export function setShortcutMenu(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/updateWxCompany`,
    method: `POST`,
    data,
  })
}

interface ChartsDataData {
  startTime: string;
  endTime: string;
}

// 查询统计图数据
export function getChartsData(data: ChartsDataData) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryMemberChat`,
    method: `POST`,
    data,
  })
}

// 微会员数据统计
export function qryMemberInfoInCrm() {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryMemberInfoInCrm`,
    method: `GET`,
    data: {},
  })
}

// 微会员数据图表统计
export function qryMemberTableInCrm(data: ChartsDataData) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryMemberTableInCrm`,
    method: `POST`,
    data,
  })
}

// 微信粉丝数据统计
export function qryFansInfoInCrm() {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryFansInfoInCrm`,
    method: `GET`,
    data: {},
  })
}

// 粉丝数据图表统计
export function qryFansTableInCrm(data: ChartsDataData) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/qryFansTableInCrm`,
    method: `POST`,
    data,
  })
}

