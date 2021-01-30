import { getLocalStorage, setStorage, getInfoStorage } from '@/utils';
import baseUrl from '@/config/config.js'
let httpUrl = baseUrl
export function toLogin() {
  const { wxUserInfo } = getLocalStorage();
  setStorage.save(JSON.stringify(wxUserInfo));
  window.location.href = `${httpUrl}/login_register/#/?c=${wxUserInfo.companyKey}&game=1`;
}

export function toRegister() {
  const { wxUserInfo } = getLocalStorage();
  const data = getInfoStorage.get()
  data.page = 'register'
  setStorage.save(JSON.stringify(data))
  window.location.href = `${httpUrl}/login_register/#/?c=${wxUserInfo.companyKey}&game=1`
}