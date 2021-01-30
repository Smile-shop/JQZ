import { origin } from './env';
import { cachePreLoginBack, clearUserInfo, getUserInfoLocal, prePage } from './userInfo'

/**
 * 发送http请求
 * @param {Object} options
 * @param {string} options.url
 * @param {Object} [options.header]
 * @param {'text' | 'arraybuffer'} [options.responseType]
 * @param {string | IAnyObject | ArrayBuffer} [options.data]
 * @param {'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'} options.method
 * @returns {Promise<any>}
 */
export async function http(options) {
  return new Promise((resolve, reject) => {
    options.data = Object.assign({}, {
      appId: '68594CF2-E947-82FA-84D0-01D4556F9F54',
      cliVersion: '',
      param: options.data,
      sign: '',
      signType: '',
      source: '',
      timestamp: 0,
      version: '',
    })
    // 登录时不需要提示信息
    const _showMsg =  options.data.param ?  options.data.param._showMsg : '' 
    const res = wx.request({
      ...options,
      success(result) {
        const { statusCode, data, errMsg, header } = result
        const { code, msg, info } = data
        if (statusCode >= 200 && statusCode < 400 || info == 'OK' || code === 0) {
          resolve(data);
        }
        if (statusCode >= 400 || code !== 0 && info !== 'OK' && !_showMsg) {
          wx.showToast({
            title: msg || '请求失败, 请稍后再试！',
            icon: 'none'
          })
        }
        if (code === 401) { // 金千枝信息异常
          cachePreLoginBack()
          const userInfo = getUserInfoLocal()
          console.log('去向', userInfo)
          let mark = 'phone'
          if (!userInfo) {
            clearUserInfo() // 清除缓存
            mark = 'login'
          }
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 3000
          })
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/login/index?mark=${mark}`
            })
          }, 3000)
        }
        if (code === 6010) { // 微信信息异常
          cachePreLoginBack()
          clearUserInfo() // 清除缓存
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 3000
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/login/index?mark=login'
            })
          }, 3000)
        }
        if (code === 6021) {
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 3000
          })
          setTimeout(() => {
            if (prePage()) {
              wx.navigateBack({
                delta: 1,
              })
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }, 3000)
        }
        reject(errMsg);
      },
      fail(result) {
        wx.showToast({
          title: '请求失败, 请稍后再试！',
          icon: 'none'
        })
        console.log('请求失败')
        reject(result);
      }
    });
  })
}