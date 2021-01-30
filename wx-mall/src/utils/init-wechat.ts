import {initWechatApi} from '@/api/common';
import store from '@/stores/index';
import {getLocalStorage} from '@/utils/local-storage';
import wx from 'wx-jssdk-ts';

export function initWeChat(options: {
  ispay: boolean
} = {
  ispay: false
}) {
  return new Promise((resolve, reject) => {
    const localStorageData = getLocalStorage();
    const {wxUserInfo, ticket, memberCard} = localStorageData;
    const initWechatApiRes = initWechatApi({
      companyKey: wxUserInfo!.companyKey,
      url: `${window.location.origin}${window.location.pathname}`,
      type: 'jsapi',
      ispay: options.ispay ? '1' : '0'
    });

    initWechatApiRes.then((res: any) => {
      const {
        appid,
        nonceStr,
        signature,
        timestamp,
      } = res;

      wx.config({
        debug: false,
        appId: appid,
        timestamp,
        nonceStr,
        signature,
        jsApiList: [
          'getLocation',
          'chooseWXPay',
          'hideMenuItems',
          'updateAppMessageShareData',
          'previewImage'
        ],
      });

      wx.ready(() => {
        console.log('wechatReady');
        resolve();
      });

      wx.error((err) => {
        console.log('wechatError');
        reject(err.errMsg);
      });
    });
  });
}
