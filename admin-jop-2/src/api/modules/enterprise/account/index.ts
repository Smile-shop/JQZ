import http from '@/utils/http';

// 保存邀请的用户邀请信息
export async function addRequestUser(body: any) {
  return http('/gshld-platform/enterprise/requestUser/addRequestUser', {
    body,
    method: 'POST',
  });
}

// 批量删除用户邀请的信息
export async function delBatchRequestUserByIds(body: any) {
  return http('/gshld-platform/enterprise/requestUser/delBatchRequestUserByIds', {
    body,
    method: 'POST',
  });
}

// 根据ID获取邀请的用户邀请信息
export async function getRequestUserById(body: any) {
  return http('/gshld-platform/enterprise/requestUser/getRequestUserById', {
    body,
    method: 'POST',
  });
}

// 根据企业ID查询邀请的并且已激活的企业用户
export async function queryActivatedIdListByEpid(body: any) {
  return http('/gshld-platform/enterprise/requestUser/queryActivatedIdListByEpid', {
    body,
    method: 'POST',
  });
}

// 分页查询邀请的企业用户
export async function queryRequestUserPage(body: any) {
  return http('/gshld-platform/enterprise/requestUser/queryRequestUserPage', {
    body,
    method: 'POST',
  });
}

// 批量保存邀请的用户邀请信息
export async function saveBatchRequestUsers(body: any) {
  return http('/gshld-platform/enterprise/requestUser/saveBatchRequestUsers', {
    body,
    method: 'POST',
  });
}

// 修改邀请的用户邀请信息
export async function updateRequestUser(body: any) {
  return http('/gshld-platform/enterprise/requestUser/updateRequestUser', {
    body,
    method: 'POST',
  });
}

// 获取企业邀请二维码
export async function getInviteQrcode(body: any) {
  return http('/gshld-platform/enterprise/enterprise/getInviteQrcode', {
    body,
    method: 'GET',
  });
}

// 获取企业邀请地址
export async function getInviteUrl(body: any) {
  return http('/gshld-platform/enterprise/enterprise/getInviteUrl', {
    body,
    method: 'GET',
  });
}
