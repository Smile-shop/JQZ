import {
  Server
} from '../models/server.js'
const server = new Server()

function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return reject(false)
      }
    })
  })
}

// 删除缓存本地信息
function removeStorageInfo() {
  wx.removeStorageSync('customerInfo')
  wx.removeStorageSync('appData')
  wx.reLaunch({
    url: '/pages/login/index'
  })
}

// 检查登录状态
function checkAndAuthorize(cb) {
  const { session_key } = wx.getStorageSync('appData')
  console.log(session_key, '+check_session_key')
  console.log(JSON.stringify(wx.getStorageSync('appData')))
  if (!session_key) {
    return cb(false)
  }
  // 检查登录session_key是否可用
  checkSession().then(loggined => {
    // server.checkSessionKey({ session_key }).then(checkTokenRes => {
    //   return cb(true)
    // }).catch(err => {
    //   return cb(false)
    // })
    return cb(true)
  }).catch(unLogined => {
    return cb(false)
  })
}

// 登录
function login(appid, cb) {
  wx.login({
    success: function (res) {
      server.wxLogin(res.code, appid).then(loginData => {
        console.log(JSON.stringify(loginData), '+loginData')
        getApp().globalData.appData = {
          companyKey: loginData.data.companyKey,
          openid: loginData.data.openid,
          session_key: loginData.data.session_key
        }
        getApp().globalData.globalStyle = loginData.data.style
        wx.setStorage({
          key: 'appData',
          data: {
            companyKey: loginData.data.companyKey,
            openid: loginData.data.openid,
            session_key: loginData.data.session_key
          }
        })
        if (cb) {
          cb(loginData.data.companyKey)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  })
}

// 检查是否登录
function checkHasLogined() {
  const appData = wx.getStorageSync('appData')
  return new Promise((resolve, reject) => {
    if (session_key && appData) {
      return resolve(true)
    } else {
      return reject(false)
    }
  })
}

module.exports = {
  checkAndAuthorize: checkAndAuthorize,
  login: login,
  checkHasLogined: checkHasLogined
  // loginOut: loginOut
}
