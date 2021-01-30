/*
 * @Descripttion:
 * @version:
 * @Author: XJHong
 * @Date: 2020-07-01 14:06:19
 * @LastEditTime: 2020-07-01 14:07:47
 */
//app.js
const CONFIG = require('config.js')
const AUTH = require('./utils/auth.js')
const { miniProgramUpdate } = require('./utils/version.js')
App({
  onLaunch(options) {
    const appid = wx.getAccountInfoSync().miniProgram.appId
    console.log(appid, '+start-appid')
    console.log(CONFIG.BASE_URL, '+start-BASE_URL')
    AUTH.login(appid, companyKey => {
      if (this.getCompanyKeyCallback) {
        this.getCompanyKeyCallback(companyKey)
      }
    })
    // AUTH.checkAndAuthorize(isLogined => {
    //   console.log(isLogined, '+isLogined')
    //   if (!isLogined) {
    //     AUTH.login(companyKey)
    //   }
    // })
    if(wx.canIUse('getUpdateManager')) {
      miniProgramUpdate()
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法自动更新版本，请升级微信版本。'
      })
    }

    const that = this
    wx.getSystemInfo({
      success(res) {
        console.log('获取系统信息成功', res.safeArea, res.model)
        that.globalData.safeArea = res.safeArea;
      },
      fail() {
        console.log('获取系统信息失败')
      }
    })
  },
  globalData: {
    userInfo: null,
    companyKey: null,
    appData: null,
    cachepath: null,
    globalStyle: '0',
    globalShare: '0', // 是否是分享进来的 1是
    globalParams: null, // 分享跳转详情参数
    isVisitor: false, // 是否为游客登录
    shareTicket: null, // 分享ticket
    assortGoods: {
      filter:[],
      selected: [],
    },
    safeArea: null
  }
})