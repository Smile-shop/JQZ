import request from '@/utils/request'
import { jopWXBaseUrl } from '@/api/pro-config'

// 公众号绑定
export function getWxCompanyKeyInfo() {
  return request({
    url: `${jopWXBaseUrl}/wxExtend/getWxComInfo`,
    method: `POST`,
    data: {}
  })
}

export function subCompanyKeyInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxExtend/postWxCompanyExtend`,
    method: `POST`,
    data
  })
}

export function getCompanyKeyPerssionInfo(companyKey: string) {
  return request({
    url: `/wx-interface-web/wtppa/check_auth/${companyKey}`,
    method: `get`
  })
}

// 菜单
export function getWxMenu() {
  return request({
    url: `${jopWXBaseUrl}/wxMenu/getWxMenuInfo`,
    method: `POST`,
    data: {}
  })
}

export function createWxMenu(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMenu/postWxMenu`,
    method: `POST`,
    data
  })
}

export function updateWxMenu(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMenu/updateWxMenu`,
    method: `POST`,
    data
  })
}

export function removeMenu(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMenu/deleteWxMenu`,
    method: `POST`,
    data
  })
}

export function getGraphic(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxAutoReply/getGraphic`,
    method: `POST`,
    data
  })
}

export function getFunction(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxAutoReply/qryFunction`,
    method: `POST`,
    data
  })
}

export function uploadWxMenu() {
  return request({
    url: `${jopWXBaseUrl}/wxMenu/uploadWxMenu`,
    method: `POST`,
    data: {}
  })
}

export function sortMenuMethods(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMenu/menuSort`,
    method: `POST`,
    data
  })
}

export function getProgrameList() {
  return request({
    url: `${jopWXBaseUrl}/wxMenu/qryMiniProgram`,
    method: `POST`,
    data: {}
  })
}

export function getProgrameCode(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMenu/qryMiniCode`,
    method: `POST`,
    responseType: `blob`,
    data
  })
}

// 自动回复
export function getWxAutoReplyInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxAutoReply/getWxAutoReplyInfo`,
    method: `POST`,
    data
  })
}
export function getReplyStateControl() {
  return request({
    url: `${jopWXBaseUrl}/wxAutoReply/qryReplyState`,
    method: `POST`
  })
}
export function replyStateControl(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxCompany/updateWxCompany`,
    method: `POST`,
    data
  })
}
// 删除自动回复中的素材
export function removeReplayContent(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxAutoReply/deleteWxAutoReply`,
    method: `POST`,
    data
  })
}

export function submitAutoReplay(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxAutoReply/postWxAutoReply`,
    method: `POST`,
    data
  })
}

// 模板消息
export function getTemplate() {
  return request({
    url: `${jopWXBaseUrl}/template/getTemplate`,
    method: `POST`,
  })
}

export function toSubmitTemplate(data: any) {
  return request({
    url: `${jopWXBaseUrl}/template/updateTemplate`,
    method: `POST`,
    data
  })
}

export function asyncTemplate() {
  return request({
    url: `${jopWXBaseUrl}/template/synchroTemplate`,
    method: `POST`,
  })
}