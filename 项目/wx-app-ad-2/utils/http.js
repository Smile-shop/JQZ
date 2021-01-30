import { getOrigin, getQuery } from './env';

/**
 * 发送http请求
 * @param {Object} options
 * @param {string} options.url
 * @param {Object} [options.header]
 * @param {'text' | 'arraybuffer'} [options.responseType]
 * @param {string | IAnyObject | ArrayBuffer} [options.data]
 * @param {'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'} options.methos
 * @returns {Promise<any>}
 */
export function http(options) {
  return new Promise((resolve, reject) => {
    const origin = getOrigin();
    const query = getQuery();
    const { url } = options;
  
    // 初始化地址
    function initURL() {
      if (url.startsWith('http')) {
        options.url = `${url}`;
      } else {
        options.url = `${origin}${url}`;
      }
    }
  
    initURL();
  
    // 初始化头部
    function initHeaders() {
      const { companyKey, activityId, openid } = query;
      options.header = {};
  
      if (companyKey) {
        options.header.companyKey = companyKey;
      }
  
      if (activityId) {
        options.header.activityId = activityId;
      }
  
      if (openid) {
        options.header.openid = openid;
      }
    }
  
    initHeaders();
  
    wx.request({
      ...options,
      success({ statusCode, data, errMsg, header }) {
        if (statusCode >= 200 && statusCode < 400) {
          if (data.code == 0) {
            resolve(data.data);
          } else {
            wx.showToast({
              icon: 'none',
              title: data.msg,
            })
            reject(data.msg);
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: data.errMsg,
          })
          reject(errMsg);
        }
      },
      fail({ errMsg }) {
        console.warn(errMsg)
        wx.showToast({
          icon: 'none',
          title: '网络请求异常了, 请稍后再试',
        })
        reject(errMsg);
      },
    });
  })
}