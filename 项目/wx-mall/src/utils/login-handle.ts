import {getLocalStorage} from '@/utils/local-storage';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';
const baseUrl: string = VUE_APP_BASE_URL;

// 退出登录
export function exit(childPage?: string) {
  const {wxUserInfo} = getLocalStorage();
  wxUserInfo!.page = null;
  wxUserInfo!.childPage = childPage;
  wxUserInfo!.localUrl = window.location.origin.concat('/wx-mall/#/');
  window.localStorage.removeItem(`ticket_${wxUserInfo!.companyKey}`);
  window.localStorage.setItem('urlData', JSON.stringify(wxUserInfo));
  window.location.href = `${baseUrl}/login_register/#/login`;
}

// 忘记密码
export function forgetPassword() {
  const {wxUserInfo} = getLocalStorage();
  wxUserInfo!.page = 'forget_password';
  window.localStorage.setItem('urlData', JSON.stringify(wxUserInfo));
  window.location.href = `${baseUrl}/login_register/#/login`;
}
