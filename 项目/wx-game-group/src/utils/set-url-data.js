import qs from 'qs'
import baseUrl from '@/config/config'
import URL from '@/config/url'

export function setUrlData() {
  const query = qs.parse(location.hash.substring(3))
  const { o, c, i, m, r, shareId, subscribe } = query
  const data =
    localStorage.getItem('urlData') &&
    JSON.parse(localStorage.getItem('urlData'))
  let urlData = {}
  if (process.env.NODE_ENV === 'production') {
    urlData = {
      activeId: shareId,
      openid: o,
      companyKey: c || (data.companyKey ? data.companyKey : ''),
      headerImg: i,
      memberCard: m,
      isRegister: r || '1',
      subscribe: subscribe || '0',
      localUrl: `${baseUrl}/wx-interface-web/wx/auth?companyKey=${c}&shareId=${shareId}&page=${URL}`
    }
  } else {
    urlData = {
      activeId: '258',
      // activeId: '376',
      openid: 'oYKLK1bSz1-L-J2NGZSbswENpM-k',
      companyKey: '01', //  测试环境
      // companyKey: '00501001', // 正式环境
      headerImg:
        'http://thirdwx.qlogo.cn/mmopen/zshZlqTMgm5CmPKOIw0xkXgKPeErhqZdrU2Y2z5TtRtxgU8WOCI9oMkenOGHjmOGF6wLNxjVU97ZRjeOfMWUqEtRCffYEUro/132',
      memberCard: 13058058525,
      isRegister: '1',
      subscribe: '1',
      localUrl: `${baseUrl}/wx-interface-web/wx/auth?companyKey=${c}&shareId=${shareId}&page=${URL}`
    }
  }

  window.sessionStorage.setItem('sessionURLData', JSON.stringify(urlData))
}


export function eraseUserInfo() {
  const URL = window.location.href
  const mainUrl = URL.split('?')[0]
  window.location.replace(mainUrl)
}

export function goBackIcon() {
  let result = false
  const len = window.history.length
  if (len > 1) {
    result = true
  }

  console.log('历史记录', len)
  return result
}