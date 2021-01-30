import http from '@/utils/http';

// 增加部门表
export async function addDepartment(body: any) {
  return http('/emp-base/sys/department/addDepartment', {
    body,
    method: 'POST',
  });
}

// 删除部门表
export async function delDepartment(body: any) {
  return http('/emp-base/sys/department/delDepartment', {
    body,
    method: 'POST',
  });
}

// 分页查询部门表
export async function queryDepartmentPage(body: any) {
  return http('/emp-base/sys/department/queryDepartmentPage', {
    body,
    method: 'POST',
  });
}

// 修改部门表
export async function updateDepartment(body: any) {
  return http('/emp-base/sys/department/updateDepartment', {
    body,
    method: 'POST',
  });
}

// 组织架构查询
export async function queryOrg(body: any) {
  return http('/emp-base/sys/org/queryOrg', {
    body,
    method: 'POST',
  });
}

// 增加人员表
export async function addUser(body: any) {
  return http('/emp-base/sys/user/addUser', {
    body,
    method: 'POST',
  });
}

// 查询企业人员职责
export async function querySelectDutyMask(body: any) {
  return http('/emp-base/sys/user/querySelectDutyMask', {
    body,
    method: 'POST',
  });
}

// 批量拷贝员工数据权限人员表
export async function batchCopyUserDataPermission(body: any) {
  return http('/emp-base/sys/user/batchCopyUserDataPermission', {
    body,
    method: 'POST',
  });
}

// 批量修改员工部门人员表
export async function batchUpdateUserDept(body: any) {
  return http('/emp-base/sys/user/batchUpdateUserDept', {
    body,
    method: 'POST',
  });
}

// 批量修改员工角色人员表
export async function batchUpdateUserRole(body: any) {
  return http('/emp-base/sys/user/batchUpdateUserRole', {
    body,
    method: 'POST',
  });
}

// 批量修改员工状态人员表
export async function batchUpdateUserStatus(body: any) {
  return http('/emp-base/sys/user/batchUpdateUserStatus', {
    body,
    method: 'POST',
  });
}

// 根据ID获取人员表
export async function getUserById(body: any) {
  return http('/emp-base/sys/user/getUserById', {
    body,
    method: 'POST',
  });
}

// 根据电话号码获取人员表
export async function getUserByPhone(body: any) {
  return http('/emp-base/sys/user/getUserByPhone', {
    body,
    method: 'POST',
  });
}

// 通过部门ID查询人员表（邀请使用）
export async function queryUserList(body: any) {
  return http('/emp-base/sys/user/queryUserList', {
    body,
    method: 'POST',
  });
}

// 分页查询人员表
export async function queryUserPage(body: any) {
  return http('/emp-base/sys/user/queryUserPage', {
    body,
    method: 'POST',
  });
}

// 修改人员表
export async function updateUser(body: any) {
  return http('/emp-base/sys/user/updateUser', {
    body,
    method: 'POST',
  });
}

// 查询数据权限
export async function queryDataPermission(body: any) {
  return http('/emp-base/sys/dataPermission/queryDataPermission', {
    body,
    method: 'POST',
  });
}

// 复制其他员工权限
export async function saveCopyDataPermission(body: any) {
  return http('/emp-base/sys/dataPermission/saveCopyDataPermission', {
    body,
    method: 'POST',
  });
}

// 保存数据权限
export async function saveDataPermission(body: any) {
  return http('/emp-base/sys/dataPermission/saveDataPermission', {
    body,
    method: 'POST',
  });
}
