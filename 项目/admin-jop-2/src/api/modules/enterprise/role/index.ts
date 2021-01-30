import http from '@/utils/http';

// 增加角色表
export async function addRole(body: any) {
  return http('/emp-base/sys/role/addRole', {
    body,
    method: 'POST',
  });
}

// 根据rid删除角色
export async function delRoleById(body: any) {
  return http('/emp-base/sys/role/delRoleById', {
    body,
    method: 'POST',
  });
}

// 根据ID获取角色表
export async function getRoleById(body: any) {
  return http('/emp-base/sys/role/getRoleById', {
    body,
    method: 'POST',
  });
}

// 查询所有系统角色表
export async function queryAllRoleList(body: any) {
  return http('/emp-base/sys/role/queryAllRoleList', {
    body,
    method: 'POST',
  });
}

// 分页查询角色表
export async function queryRolePage(body: any) {
  return http('/emp-base/sys/role/queryRolePage', {
    body,
    method: 'POST',
  });
}

// 停用或者启用角色
export async function updateEnableRole(body: any) {
  return http('/emp-base/sys/role/updateEnableRole', {
    body,
    method: 'POST',
  });
}

// 修改角色表
export async function updateRole(body: any) {
  return http('/emp-base/sys/role/updateRole', {
    body,
    method: 'POST',
  });
}
