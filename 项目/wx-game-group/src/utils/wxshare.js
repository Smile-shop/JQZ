import {
  getwxToken,
  queryShare,
  shareSuccess,
  shareCounter,
} from '@/axios/tiger'

async function _getToken() {
  const { companyKey, id } = this.$route.query
  const sendCompanyKey = companyKey ? companyKey : this.userInfo.companyKey
  const activeId = id

  const options = {
    companyKey: sendCompanyKey,
    url: window.location.href.split('#')[0],
    type: 'jsapi'
  }
  const { data } = await getwxToken(options)
  // eslint-disable-next-line
  wx.config({
    debug: false,
    appId: data.appid,
    timestamp: data.timestamp,
    nonceStr: data.nonceStr,
    signature: data.signature,
    jsApiList: [
      // 'updateAppMessageShareData',
      // 'updateTimelineShareData',
      'onMenuShareTimeline',
      'onMenuShareAppMessage'
    ]
  })

  const { data: shareData } = await queryShare({
    activeId: activeId
  })

  // 发送一个全局分享数据事件，共享给抽奖后的分享次数显示
  // EventBus.$emit('getShareInfo', this.shareData)

  const card = this.userInfo.memberCard

  // eslint-disable-next-line
  wx.ready(function () {
    // eslint-disable-next-line
    wx.onMenuShareTimeline({
      title: shareData.shareTitle,
      link: window.location.origin.concat(
        `/wx-interface-web/wx/auth?companyKey=${options.companyKey}&shareId=${shareData.activeId}&page=${URL}`
      ),
      desc: shareData.shareContent,
      imgUrl: shareData.shareImg,
      success: function () {
        const options = {
          activeId: shareData.activeId,
          memberCard: card
        }
        shareCounter(options).then(() => {
          // alert('恭喜你，分享成功！')
        })
        shareSuccess(options).then(() => {
          alert('恭喜你，分享成功！')
        })
      }
    })

    // eslint-disable-next-line
    wx.onMenuShareAppMessage({
      title: shareData.shareTitle,
      link: window.location.origin.concat(
        `/wx-interface-web/wx/auth?companyKey=${options.companyKey}&shareId=${shareData.activeId}&page=${URL}`
      ),
      desc: shareData.shareContent,
      imgUrl: shareData.shareImg,
      success: function () {
        const options = {
          activeId: shareData.activeId,
          memberCard: card
        }
        // shareCounter(options).then(result => {
        shareCounter(options).then(() => {
          // alert('恭喜你，分享成功！')
        })
        // shareSuccess(options).then(result => {
        shareSuccess(options).then(() => {
          alert('恭喜你，分享成功！')
        })
      }
    })

    // eslint-disable-next-line
    // wx.updateTimelineShareData(wxShare)
    // eslint-disable-next-line
    // wx.updateAppMessageShareData(wxShare)
  })

}


export default _getToken