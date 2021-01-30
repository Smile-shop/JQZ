const app = getApp()
import log from './log'
import { values } from './filterApi'
const USERINFO = 'userInfo'
const WXTOKEN = 'WxToken'
const JQZTOKEN = 'JqzToken'
const WXLOGINCODE = 'loginCode'
const WMID = 'wmid'

// 查询有无上一页
export function prePage() {
  const pages = getCurrentPages()
  let result = false
  if (pages.length > 1) {
    result = true
  }

  return result
}

// 获取当前页面 URL
export function getCurrentPageUrl() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = `/${currentPage.route}`
  log('页面路由', pages, currentPage, url)
  return url
}

// 获取当前页面 URL 参数
export function getPageUrlArgs() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const args = currentPage.options
  log('存储页面url参数', currentPage.options)
  return args
}


// 获取金千枝用户信息
export function getJqzUserInfo() {
  try {
    var value = wx.getStorageSync(JQZTOKEN)
    if (value) {
      return value
    }
  } catch (e) {
    // Do something when catch error
    log('userInfo: ', e)
  }
}

// 清除所有用户数据
export async function clearUserInfo() {
  try {
    wx.clearStorageSync()
  } catch(err) {
    
  }
}

// 检测用户微信授权过期
export async function checkWxAuth() {
  wx.checkSession({
    success () {
      //session_key 未过期，并且在本生命周期一直有效
    },
    fail () {
      // session_key 已经失效，需要重新执行登录流程
      wx.login() //重新登录
    }
  })
}

// 存储用户信息
export async function saveUserInfoLocal(info) {
  const options = Object.assign({}, info)
  log('存储用户信息', options)
  wx.setStorage({
    key: USERINFO,
    data: options,
  })
}

// 存储微信授权登录
export async function saveWxLoginWmid(wmid) {
  wx.setStorage({
    data: WMID,
    key: wmid,
  })
}

// 获取微信授权登录信息
export async function queryWxLoginWmind() {
  try {
    var value = wx.getStorageSync(WMID)
    if (value) {
      return value
    }
  } catch (e) {
    // Do something when catch error
    log('userInfo: ', e)
  }
}

// 获取用户信息
export function getUserInfoLocal() {
  try {
    var value = wx.getStorageSync(USERINFO)
    if (value) {
      return value
    }
  } catch (e) {
    // Do something when catch error
    log('userInfo: ', e)
  }
}

// 用户信息存在么？
export async function userInfoLocal() {
  try {
    var value = wx.getStorageSync(USERINFO)
    log('用户信息存在么', value)
    if (value) {
      return { code: 0 }
    } else {
      return { code: 1 }
    }
  } catch (e) {
    // Do something when catch error
    log('userInfo: ', e)
    return { code: 1 }
  }
}

// 存储用户信息及门店情况
export async function saveUserInfoAndStore(info, curInfo) {
  log('上一次的数据', curInfo)
  const options = Object.assign({}, info, curInfo)
  log('后一次数据', options)
  app.globalData.userInfoAndStore = options
  try { wx.setStorageSync('userInfoAndStore', options) } catch (e) { }
  // try { wx.setStorageSync('userInfoAndStore', info) } catch (e) { }
}

// 存储登录时候的用户会员及门店信息
export async function saveLoginUserInfo(info) {
  try {
    wx.setStorageSync('loginUserInfoAndStore', info)
  } catch(err) {

  }
}

// 获取用户信息及门店情况
export async function queryUserInfoAndStore() {
  try {
    const value = wx.getStorageSync('loginUserInfoAndStore')
    return value
  } catch(e) {
    log(e)
  }
}

// 获取微信登录 code 
export async function queryWxLoginCode() {
  try {
    // var value = wx.getStorageSync(WXLOGINCODE)
    var value = app.globalData.loginCode
    log('获取微信 code 信息', value)
    if (value) {
      return value
    }
  } catch (e) {
    // Do something when catch error
    log('wx code: ', e)
  }
}

// 存储微信登录 code
const saveLoginCode = async (code) => {
  const options = code
  try {
    // wx.setStorageSync(WXLOGINCODE, options)
    app.globalData.loginCode = options
  } catch (e) { }
}

// 缓存登录前页面为了登录成功返回
export function cachePreLoginBack() {
  const url = getCurrentPageUrl()
  const args = getPageUrlArgs()
  cachePageUrl(url)
  cacheUrlArgs(args)
}

// 存储当前进入登录页面
export function cachePageUrl(url) {
  log('存储需要返回的页面', url)
  app.globalData.toLoginUrl = url
}

// 存储 URL 参数
export function cacheUrlArgs(args) {
  log('保存参数', args)
  app.globalData.queryGoods = args
}

// 微信登录信息
export async function getWxLoginInfo(save = true) {
  return await new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        log('登录成功', res)
        const suc = 'login:ok'
        const { errMsg, code } = res
        if (errMsg === suc) {
          saveLoginCode(code)
          if (save) {
            const url = getCurrentPageUrl()
            const args = getPageUrlArgs()
            cachePageUrl(url)
            cacheUrlArgs(args)
          }
          resolve({ code: 0, data: code })
        } else {
          resolve({ code: 1 })
        }
      },
      fail: function () {
        resolve({ code: 1 })
      }
    })
  })
}

// 验证 token 是否过期
export async function checkTokenValidity() {
  return await new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        resolve({ code: 0 })
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        // wx.login() //重新登录
        resolve({ code: 1 })
      }
    })
  })
}

// 存储微信 token
export async function saveWxToken(wxtoken) {
  const options = wxtoken
  try {
    log('存储微信token', options)
    await wx.setStorageSync(WXTOKEN, options)
  } catch (e) { }
}

// 获取微信 token
export function queryWxToken() {
  try {
    var value = wx.getStorageSync(WXTOKEN)
    log('获取微信 token 信息', value)
    if (value) {
      return value
    }
  } catch (e) {
    // Do something when catch error
    log('wx token: ', e)
  }
}

// 存储金千枝 token
export async function saveJqzToken(jqztoken) {
  const options = jqztoken
  wx.setStorage({
    key: JQZTOKEN,
    data: options,
  })
}

// 获取金千枝 token
export function queryJqzToken() {
  try {
    var value = wx.getStorageSync(JQZTOKEN)
    // log('获取金千枝 token 信息', value)
    if (value) {
      return value
    }
  } catch (e) {
    // Do something when catch error
    log('jqz token: ', e)
  }
}

// 我的页面游客去登录
export async function  tourist() {
  const wxLogin = await getUserInfoLocal()
  const userInfo = await getJqzUserInfo()
  if (!wxLogin) {
    await cachePreLoginBack()
    wx.navigateTo({
      url: '/pages/login/index?mark=login'
    })
    return true
  } else if (!userInfo) {
    await cachePreLoginBack()
    wx.navigateTo({
      url: '/pages/login/index?mark=phone'
    })
    return true
  }
  return false
}