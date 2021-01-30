import {
  shareSuccess,
  shareCounter,
} from '@/axios/tiger'
import URL from '@/config/url.js'
import { getLocalStorage } from '@/utils/local-storage'
import {
  share
} from '@/axios/api.js'
import baseUrl from '@/config/config.js';

const shareSuccessCallback = function () {
  window.location.reload()
}

const wxShareInit = function (data, options) {
  let page = window.location.href.split('#')[1];
  let str = window.location.href.split('#')[1].slice(-1);

  if (str.indexOf('/') != -1) {
    page = window.location.href.split('?')[1];
  }

  if (page.indexOf('?') >= 0) {
    let index = page.indexOf('?');
    page = page.slice(1, index);
  }

  const { memberCard } = getLocalStorage()
  let body = data,
    httpUrl = baseUrl,
    shareImg = options.shareImg,
    shareTitle = options.shareTitle,
    activeId = options.activeId,
    isMember = options.isMember,
    shareContent = options.shareContent;
  share(body)
    .then(res => {
      let {
        companyKey
      } = body;
      let resData = res;
      // eslint-disable-next-line
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: resData.appid, // 必填，公众号的唯一标识
        timestamp: resData.timestamp, // 必填，生成签名的时间戳
        nonceStr: resData.nonceStr, // 必填，生成签名的随机串
        signature: resData.signature, // 必填，签名
        jsApiList: [
          "updateAppMessageShareData",
          "updateTimelineShareData",
          'onMenuShareTimeline',
          'onMenuShareAppMessage'
        ]
        // 必填，需要使用的JS接口列表
      });
      // eslint-disable-next-line
      wx.ready(function () {
        // eslint-disable-next-line
        wx.onMenuShareAppMessage({
          title: shareTitle,
          desc: shareContent,
          link: httpUrl + '/wx-interface-web/wx/auth?&p1=' + isMember + '&shareId=' + activeId + '&companyKey=' + companyKey + '&childPage=' + page + `&page=${URL}`,
          imgUrl: shareImg,
          success: function () {
            // alert('分享成功')
            const options = {
              activeId,
              memberCard,
            }
            shareCounter(options).then(() => {
              // alert('恭喜你，分享成功！')
            })
            shareSuccess(options).then(() => {
              alert('恭喜你，分享成功！')
              shareSuccessCallback()
            })
          },

        });
        // eslint-disable-next-line
        wx.onMenuShareTimeline({
          title: shareTitle,
          link: httpUrl + '/wx-interface-web/wx/auth?&shareId=' + activeId + '&companyKey=' + companyKey + '&childPage=' + page + `&page=${URL}`,
          imgUrl: shareImg,
          // success: function (res) {
          // },
          success: function () {
            // alert('分享成功')
            const options = {
              activeId,
              memberCard,
            }
            shareCounter(options).then(() => {
              // alert('恭喜你，分享成功！')
            })
            shareSuccess(options).then(() => {
              alert('恭喜你，分享成功！')
              shareSuccessCallback()
            })
          },
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
}

export default wxShareInit;