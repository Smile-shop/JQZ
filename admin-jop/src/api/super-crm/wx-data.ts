import request from '@/utils/request'
import { jopWXBaseUrl, jopWebBaseUrl } from '@/api/pro-config'

export function getSelectShopList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/shopapi/list`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getSelectSalerList(data: any) {
  return request({
    url: `${jopWebBaseUrl}/wxBind/qrySaler`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

// 微会员注册统计
export function getMemberRegisterCount() {
  return request({
    url: `${jopWXBaseUrl}/member/qryMemberCount`,
    method: `POST`,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getMemberGroupShop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/member/queryMemberGroupShop`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}
export function queryMemberGroupShopWithOffLine(data: any) {
  return request({
    url: `${jopWXBaseUrl}/member/queryMemberGroupShopWithOffLine`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getMemberGroupByTime_Shop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/member/queryMemberGroupTime`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getMemberGroupShop1(data: any) {
  return request({
    url: `${jopWXBaseUrl}/member/getMembersRegister`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}
export function getMembersRegisterWithOffLine(data: any) {
  return request({
    url: `${jopWXBaseUrl}/member/getMembersRegisterWithOffLine`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

// 门店关注统计
export function getShopFocusCount() {
  return request({
    url: `${jopWXBaseUrl}/shopCus/qryShopCusNum`,
    method: `POST`,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getShopFocusTotal(data: any) {
  return request({
    url: `${jopWXBaseUrl}/shopCus/qryWxShopCusInfo`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getShopFocusByTime_Shop(data: any) {
  return request({
    url: `${jopWXBaseUrl}/shopCus/getShopCusFold`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getShopFocusDetail(data: any) {
  return request({
    url: `${jopWXBaseUrl}/shopCus/getShopCusDetail`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getSalemanFocusTotal(data: any) {
  return request({
    url: `${jopWXBaseUrl}/salecus/getSaleCusNum`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

// 会员活跃度
export function getTimeActivity(data: any) {
  return request({
    url: `${jopWXBaseUrl}/apiStatistics/timeActivity`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getMemberActivity(data: any) {
  return request({
    url: `${jopWXBaseUrl}/apiStatistics/month_week_today`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

// 功能访问统计
export function getApiList() {
  return request({
    url: `${jopWXBaseUrl}/apiStatistics/apilist`,
    method: `POST`,
    data: {},
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getTableSumActivity(data: any) {
  return request({
    url: `${jopWXBaseUrl}/apiStatistics/sumActivity`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getTimeActivityByGroup(data: any) {
  return request({
    url: `${jopWXBaseUrl}/apiStatistics/time_groupby`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}

export function getStatisticsByApi(data: any) {
  return request({
    url: `${jopWXBaseUrl}/apiStatistics/byapi`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineMember`
    }
  })
}