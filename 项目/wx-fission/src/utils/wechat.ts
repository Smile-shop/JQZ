import { initWechatJsSdk } from "@/api";
import store from '@/store';
import { isApple } from '@/utils/platform';

export async function config() {
  try {
    const {
      appid,
      nonceStr,
      signature,
      timestamp,
    } = await initWechatJsSdk({
      companyKey: store.state.user.platCompanyKey,
      url: isApple() ? store.state.initLocationHref.split('#')[0] : location.href.split('#')[0],
      type: 'jsapi',
      ispay: '1'
    })

    window.wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appid, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature,// 必填，签名
      jsApiList: [
        'getLocation',
        'chooseWXPay',
        'scanQRCode',
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'hideAllNonBaseMenuItem',
        'hideMenuItems'
      ] // 必填，需要使用的JS接口列表
    });
  } catch (error) {
    console.warn(error);
  }
}

export function updateShare() {
  const share = store.state.share;

  window.wx.updateAppMessageShareData({
    title: share.title, // 分享标题
    desc: share.desc, // 分享描述
    link: share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: share.imgUrl, // 分享图标
    success: function () {
      // 设置成功
    }
  })

  window.wx.updateTimelineShareData({
    title: share.title, // 分享标题
    desc: share.desc, // 分享描述
    link: share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: share.imgUrl, // 分享图标
    success: function () {
      // 设置成功
    }
  })
}

export function hideAllNonBaseMenuItem() {
  const home = store.state.home;

  if (home.isDistributionType == 0 && home.purchased == 0) {
    window.wx.hideAllNonBaseMenuItem();
  }
}

export function hideMenuItems() {
  window.wx.hideMenuItems({
    menuList: ['menuItem:exposeArticle', 'menuItem:copyUrl', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
  });
}
