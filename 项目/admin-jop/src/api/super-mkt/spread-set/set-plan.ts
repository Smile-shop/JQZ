import request from '@/utils/request'
import { jopMarketingWebBaseUrl } from '@/api/pro-config'

export function updateScheme(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/activeExtension/updateScheme`,
    method: `POST`,
    data
  })
}

export function querySchemeList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/activeExtension/querySchemeList`,
    method: `POST`,
    data
  })
}

export function querySchemeInfo(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/activeExtension/querySchemeInfo`,
    method: `POST`,
    data
  })
}

export function deleteScheme(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/activeExtension/deleteScheme`,
    method: `POST`,
    data
  })
}

// JMP会员等级查询
export function queryMemberGrade(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryMemberGrade`,
    method: 'POST',
    data,
  })
}