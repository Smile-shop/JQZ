import request from '@/utils/request'
import { jopAdminBaseUrl, jopWXBaseUrl, appBaseUrl, jopMarketingWebBaseUrl } from '@/api/pro-config'

// 验证短信查询
export function getSMSInfo() {
  return request({
    url: `${jopWXBaseUrl}/sms/query`,
    method: `POST`
  })
}

export function setSMSInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/sms/update`,
    method: `POST`,
    data
  })
}

// 图片访问设置
export function getPictureSet() {
  return request({
    url: `${jopWXBaseUrl}/ftp/query`,
    method: `POST`,
    data: {}
  })
}

export function setPictureSet(data: any) {
  return request({
    url: `${jopWXBaseUrl}/ftp/update`,
    method: `POST`,
    data
  })
}

// 修改密码
export function getCompanyInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/extra/companyinfo`,
    method: `POST`,
    data
  })
}

export function sendPhoneMsg(data: any) {
  return request({
    url: `${jopWXBaseUrl}/commonSms/send`,
    method: `POST`,
    data
  })
}

export function updatePsd(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/updateMainAccountPwd`,
    method: `POST`,
    data
  })
}

// 用户维护

// 职位
export function getAccountPositionList(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountPosition/listAccountPosition`,
    method: `POST`,
    data
  })
}

export function toCreatePositionMethods(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountPosition/postAccountPosition`,
    method: `POST`,
    data
  })
}

export function toUpdatePositionMethods(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountPosition/patchAccountPosition`,
    method: `POST`,
    data
  })
}

export function deletePositionMethods(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountPosition/delAccountPosition`,
    method: `POST`,
    data
  })
}

export function getAllAccountPositionListInfo(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountPosition/getAccountPositionInfo`,
    method: `POST`,
    data
  })
}

export function toBindAccountMethods(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountPosition/updatePositionDetail`,
    method: `POST`,
    data
  })
}

// 账户管理
export function getAccountGroups(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountGroup/listGroupNames`,
    method: `POST`,
    data
  })
}

export function searchAccountList(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountGroup/listGroupAccountInfo`,
    method: `POST`,
    data
  })
}

export function searchAPPlist(data: any) {
  return request({
    url: `${appBaseUrl}/jopBind/getJopAccountList`,
    method: `POST`,
    data
  })
}

export function JMPBingMethod(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/bindJmpAccount`,
    method: `POST`,
    data
  })
}

export function toCancelJMPBingMethod(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/unbindJmpAccount`,
    method: `POST`,
    data
  })
}

export function cancelAPPBingMethod(data: any) {
  return request({
    url: `${appBaseUrl}/jopBind/removeBindJopAccount`,
    method: `POST`,
    data
  })
}

export function updateAccountInfo(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/patchAccount`,
    method: `POST`,
    data
  })
}

export function updateJopAccountPwd(data: any) {
  return request({
    url: `${appBaseUrl}/jopBind/updateJopAccountPwd`,
    method: `POST`,
    data
  })
}

export function deleteAccountInfo(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/delAccount`,
    method: `POST`,
    data
  })
}

export function getAllChannelList() {
  return request({
    url: `${jopAdminBaseUrl}/channel/getChannelList`,
    method: `POST`,
  })
}

export function getAppsByChannel(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/appMenu/getChildAccountAppPermissions`,
    method: `POST`,
    data
  })
}

export function deletePermissionsTemplates(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/permissionTemplate/deletePermissionsTemplates`,
    method: `POST`,
    data
  })
}

export function getAccountAllPermission(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/appMenu/getAppPermissions`,
    method: `POST`,
    data
  })
}

export function getPermissionsTemplates(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/permissionTemplate/getPermissionsTemplates`,
    method: `POST`,
    data
  })
}

export function updateAccountPermissionMethods(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/appMenu/updateAppPermissions`,
    method: `POST`,
    data
  })
}

export function updatePermissionsTemplates(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/permissionTemplate/updatePermissionsTemplates`,
    method: `POST`,
    data
  })
}

export function listPermissionsTemplates(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/permissionTemplate/listPermissionsTemplates`,
    method: `POST`,
    data
  })
}

export function getAccountWithGroup(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountGroup/listGroupAccounts`,
    method: `POST`,
    data
  })
}

export function createAccountGroup(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountGroup/postAccountGroup`,
    method: `POST`,
    data
  })
}

export function createAccountInfo(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/postAccount`,
    method: `POST`,
    data
  })
}

export function toRemoveAccountGroup(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountGroup/delAccountGroup`,
    method: `POST`,
    data
  })
}

export function toUpdateAccountGroup(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/accountGroup/patchAccountGroup`,
    method: `POST`,
    data
  })
}

export function delAccountByBatch(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/delAccountByBatch`,
    method: `POST`,
    data
  })
}

export function updateAccountByBatch(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/account/updateAccountByBatch`,
    method: `POST`,
    data
  })
}
// 会员管理
// 消息提醒类型设置--查询
export function getmemberMessgeRemindInfo() {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/getmemberMessgeRemindInfo`,
    method: `POST`,
    data: {}
  })
}
// 消息提醒类型设置--新增修改
export function messgeRemindSet(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/messgeRemindSet`,
    method: `POST`,
    data
  })
}
// 操作功能设置--查询
export function getMemberOperatSetInfo() {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/getMemberOperatSetInfo`,
    method: `POST`,
    data: {}
  })
}
// 操作功能设置-- 信息设置
export function patchMemberOperatSetInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/patchMemberOperatSetInfo`,
    method: `POST`,
    data
  })
}
// 操作功能设置-- (营销)设置
export function patchGiveOperatSetInfo(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/patchGiveOperatSetInfo`,
    method: `POST`,
    data
  })
}
// 查询会员标签
export function listMemberTag(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/listMemberTag`,
    method: `POST`,
    data
  })
}
// 修改会员标签
export function updateMemberTag(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/updateMemberTag`,
    method: `POST`,
    data
  })
}
// 修改会员标签状态
export function updateMemberTagStatus(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/updateMemberTagStatus`,
    method: `POST`,
    data
  })
}
// 添加会员标签
export function addMemberTag(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/addMemberTag`,
    method: `POST`,
    data
  })
}
// 粉丝列表权限查询
export function fansPermissions() {
  return request({
    url: `${appBaseUrl}/fans/fansPermissions`,
    method: `POST`,
    data: {}
  })
}
// 粉丝列表权限设置
export function fansSetting(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMemberManager/fansSetting`,
    method: `POST`,
    data
  })
}
// 快捷消息查询
export function shortcutInfoSetQuery() {
  return request({
    url: `${appBaseUrl}/shortcutInfoSet/query`,
    method: `POST`,
    data: {}
  })
}
// 快捷消息添加/修改
export function shortcutInfoSetAdd(data: any) {
  return request({
    url: `${appBaseUrl}/shortcutInfoSet/add`,
    method: `POST`,
    data
  })
}
// 快捷消息删除
export function shortcutInfoSetDel(data: any) {
  return request({
    url: `${appBaseUrl}/shortcutInfoSet/del`,
    method: `POST`,
    data
  })
}
// 门店管理查询
export function getCustomerShopSetting(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/customerShopSetting/getCustomerShopSetting`,
    method: `POST`,
    data
  })
}
// 门店管理保存
export function updateCustomerShopSetting(data: any) {
  return request({
    url: `${jopAdminBaseUrl}/customerShopSetting/updateCustomerShopSetting`,
    method: `POST`,
    data
  })
}
// 查询通知用户
export function queryNoticeUserList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/template/queryNoticeUserList`,
    method: `POST`,
    data
  })
}
// 查询库存预警通知列表
export function getTemplateByWarningStock(data: any) {
  return request({
    url: `${jopWXBaseUrl}/template/getTemplateByWarningStock`,
    method: `POST`,
    data
  })
}
// 查询微信用户
export function queryWxUserPage(data: any) {
  return request({
    url: `${jopWXBaseUrl}/template/queryWxUserPage`,
    method: `POST`,
    data
  })
}
// 保存或修改通知用户
export function saveOrUpdateNoticeUser(data: any) {
  return request({
    url: `${jopWXBaseUrl}/template/saveOrUpdateNoticeUser`,
    method: `POST`,
    data
  })
}
// 修改模板设置是否开启
export function updateTemplateisOpen(data: any) {
  return request({
    url: `${jopWXBaseUrl}/template/updateTemplateisOpen`,
    method: `POST`,
    data
  })
}
// 删除通知用户
export function delNoticeUser(data: any) {
  return request({
    url: `${jopWXBaseUrl}/template/delNoticeUser`,
    method: `POST`,
    data
  })
}
// 查询所属店
export function queryShopList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryShopList`,
    method: `POST`,
    data
  })
}