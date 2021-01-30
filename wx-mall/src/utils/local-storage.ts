import {LocalStorage} from '@/typings/utils';

export function getLocalStorage(): LocalStorage.StorageData {
  const wxUserInfo = localStorage.getItem('urlData');
  const storageData: LocalStorage.StorageData = {
    wxUserInfo: null,
    ticket: null,
    memberCard: null,
    loginInfo: null,
  };

  if (wxUserInfo) {
    const wxUserInfoJSON: LocalStorage.WxUserInfo = JSON.parse(wxUserInfo);
    const ticket = localStorage.getItem(`ticket_${wxUserInfoJSON.companyKey}`);
    const loginInfo = localStorage.getItem('loginInfo');

    storageData.wxUserInfo = wxUserInfoJSON;
    storageData.ticket = ticket;
    storageData.memberCard = wxUserInfoJSON.memberCard || localStorage.getItem('memberCard');
    storageData.loginInfo = loginInfo ? JSON.parse(loginInfo) : null;
  }

  return storageData;
}
