import http from '@/utils/http';

// JMP和EMP用户登录
export async function login(body: any) {
  return http('/emp-base/sys/emploginUser/login', {
    body,
    method: 'POST',
  });
}

// 根据ID获取JMP和EMP登录用户表
export async function checkAuth(body: any) {
  return http('/emp-base/sys/emploginUser/checkAuth', {
    body,
    method: 'POST',
  });
}

// 根据ID获取JMP和EMP登录用户表
export async function getLoginUserById(body: any) {
  return http('/emp-base/sys/emploginUser/getLoginUserById', {
    body,
    method: 'POST',
  });
}

// JMP和EMP用户退出登录
export async function logout(body: any) {
  return http('/emp-base/sys/emploginUser/logout', {
    body,
    method: 'POST',
  });
}

// 分页查询JMP和EMP登录用户表
export async function queryLoginUserPage(body: any) {
  return http('/emp-base/sys/emploginUser/queryLoginUserPage', {
    body,
    method: 'POST',
  });
}

// 修改当前用户密码
export async function updateCurUserPwd(body: any) {
  return http('/emp-base/sys/emploginUser/updateCurUserPwd', {
    body,
    method: 'POST',
  });
}

// 禁用或者启用用户表
export async function updateEnabledLoginUser(body: any) {
  return http('/emp-base/sys/emploginUser/updateEnabledLoginUser', {
    body,
    method: 'POST',
  });
}

// 修改或者增加JMP和EMP登录用户表
export async function updateLoginUser(body: any) {
  return http('/emp-base/sys/emploginUser/updateLoginUser', {
    body,
    method: 'POST',
  });
}

// 获取验证码
export async function captcha(body: any) {
  return http('/emp-base/sys/emploginUser/captcha', {
    body,
    method: 'POST',
  });
}
