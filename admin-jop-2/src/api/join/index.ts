import http from '@/utils/http';

interface LoginDTO {
  userName: string;
  password: string;
}

// 扫码确认界面初始化
export async function queryConfirmInit(body: any) {
  return http('/gshld-platform/platform/joinUs/queryConfirmInit', {
    body,
    method: 'POST',
  });
}
// 获取验证码检查手机号
export async function querySendSmsCode(body: any) {
  return http('/gshld-platform/platform/joinUs/querySendSmsCode', {
    body,
    method: 'POST',
  });
}

// APP确认接受邀请
export async function saveConfirm(body: any) {
  return http('/gshld-platform/platform/joinUs/saveConfirm', {
    body,
    method: 'POST',
  });
}

// 其他通讯工具确认接受邀请
export async function saveConfirmOther(body: any) {
  return http('/gshld-platform/platform/joinUs/saveConfirmOther', {
    body,
    method: 'POST',
  });
}
