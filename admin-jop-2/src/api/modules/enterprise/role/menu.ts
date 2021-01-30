import http from '@/utils/http';

// 授权EMP角色菜单权限表
export async function addPrivilegeMenu(body: any) {
  return http('/gshld-platform/emp/sysPrivilegeMenu/addPrivilegeMenu', {
    body,
    method: 'POST',
  });
}

// 根据ID获取菜单权限
export async function getSysPrivilegeMenuById(body: any) {
  return http('/gshld-platform/emp/sysPrivilegeMenu/getSysPrivilegeMenuById', {
    body,
    method: 'POST',
  });
}

// 查询当前用户的菜单
export async function queryCurUserPrivilegeMenu(body: any) {
  return http('/gshld-platform/emp/sysPrivilegeMenu/queryCurUserPrivilegeMenu', {
    body,
    method: 'POST',
  });
}

// 查询角色权限列表
export async function queryRolePrivilegeMenuList(body: any) {
  return http('/gshld-platform/emp/sysPrivilegeMenu/queryRolePrivilegeMenuList', {
    body,
    method: 'POST',
  });
}

// 分页查询菜单权限
export async function querySysPrivilegeMenuPage(body: any) {
  return http('/gshld-platform/emp/sysPrivilegeMenu/querySysPrivilegeMenuPage', {
    body,
    method: 'POST',
  });
}

// 修改菜单权限
export async function updateSysPrivilegeMenu(body: any) {
  return http('/gshld-platform/emp/sysPrivilegeMenu/updateSysPrivilegeMenu', {
    body,
    method: 'POST',
  });
}
