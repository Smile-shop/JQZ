// pages/authorization/authorization.js
import {
  Server
} from '../../models/server.js'
const server = new Server()

const app = getApp()
const CONFIG = require('../../config.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    homePageData: null,
    globalStyle: getApp().globalData.globalStyle
  },

  // 判断是否登录
  checkIsLogined() {
    return new Promise((resolve, reject) => {
      const customerInfo = wx.getStorageSync('customerInfo')
      if (customerInfo) {
        if (customerInfo.loginTime + 7 * 24 * 60 * 60 * 1000 < Date.now()) {
          console.log('登录时间超过一周')
          wx.removeStorageSync('customerInfo')
          reject()
        } else {
          resolve()
        }
      } else {
        reject()
      }
    })
  },

  toLogin() {
    wx.navigateTo({
      url: '/pages/login/index'
    })
  },

  onLoad: function () {},
  onShow: function () {
    this.setData({
      globalStyle: app.globalData.globalStyle
    })
    this.checkIsLogined().then(() => {
      wx.switchTab({
        url: '../home/index'
      })
    }).catch(() => {
      if (app.globalData.companyKey) {
        this.getHomePageInfo()
      } else {
        this.getHomePageInfo()
        // app.getCompanyKeyCallback = companyKey => {
        //   if (companyKey) {
        //     this.getHomePageInfo()
        //   }
        // }
      }
    })
  },

  getHomePageInfo() {
    const companyKey = app.globalData.companyKey
    server.getHomeGoods(companyKey).then(res => {
      this.setData({
        homePageData: res.data
      })
      if (res.data.wholeSalePageSet) {
        app.globalData.globalStyle = res.data.wholeSalePageSet.style || '0'
      }
    }).catch(err => {
      console.log(err)
    })
  }
})