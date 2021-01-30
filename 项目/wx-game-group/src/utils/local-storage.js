export function getLocalStorage() {
  const wxUserInfo = localStorage.getItem('urlData')

  const storageData = {
    wxUserInfo: null,
    ticket: null,
    memberCard: null,
    activeId: null,
    companyKey: null,
    openid: null,
    subscribe: null
  };

  if (wxUserInfo) {
    const wxUserInfoJSON = JSON.parse(wxUserInfo);
    const ticket = localStorage.getItem(`ticket_${wxUserInfoJSON.companyKey}`);
    // const ticket = wxUserInfoJSON.ticket
    const memberCard = wxUserInfoJSON.memberCard;

    storageData.ticket = ticket
    storageData.activeId = wxUserInfoJSON.activeId
    storageData.companyKey = wxUserInfoJSON.companyKey
    storageData.openid = wxUserInfoJSON.openid
    storageData.subscribe = Number(wxUserInfoJSON.subscribe)

    storageData.wxUserInfo = wxUserInfoJSON;
    storageData.memberCard = memberCard;

    if (ticket) {
      const wxLocalUserInfo = localStorage.getItem('urlData')
      if (wxLocalUserInfo) {
        const wxLocalUserInfoJSON = JSON.parse(wxLocalUserInfo)
        storageData.wxUserInfo = wxLocalUserInfoJSON
        storageData.memberCard = wxLocalUserInfoJSON.memberCard
      }
    }
  }

  return storageData;
}