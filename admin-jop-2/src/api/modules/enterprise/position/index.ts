import http from '@/utils/http';

// 增加职位表
export async function addUserTitle(body: any) {
  return http('/emp-base/sys/userTitle/addUserTitle', {
    body,
    method: 'POST',
  });
}

// 根据ID删除职位
export async function delUserTitleById(body: any) {
  return http('/emp-base/sys/userTitle/delUserTitleById', {
    body,
    method: 'POST',
  });
}

// 根据ID获取职位表
export async function getUserTitleById(body: any) {
  return http('/emp-base/sys/userTitle/getUserTitleById', {
    body,
    method: 'POST',
  });
}

// 查询企业所有的职位Id和职位名称
export async function querySelectUserTitle(body: any) {
  return http('/emp-base/sys/userTitle/querySelectUserTitle', {
    body,
    method: 'POST',
  });
}

// 分页查询职位表
export async function queryUserTitlePage(body: any) {
  return http('/emp-base/sys/userTitle/queryUserTitlePage', {
    body,
    method: 'POST',
  });
}

// 修改职位表
export async function updateUserTitle(body: any) {
  return http('/emp-base/sys/userTitle/updateUserTitle', {
    body,
    method: 'POST',
  });
}
