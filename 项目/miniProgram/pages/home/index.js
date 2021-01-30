// pages/home/index.js
import {
  Server
} from '../../models/server.js'

let server = new Server()

const app = getApp()
const CONFIG = require('../../config.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    homePageData: null
  },

  onShow: function () {
    if (typeof this.getTabBar == 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 0,
        globalStyle: app.globalData.globalStyle
      })
    }
    server.getHomeGoods().then(res => {
      const {
        goldPriceListVO,
        showPicturesS,
        recommendS,
        recommendProductVO1,
        recommendProductVO2
      } = res.data;
      this.setData({
        homePageData: res.data
      })
    }).catch(err => {
      console.log(err)
    })
    this.setData({
      globalStyle: getApp().globalData.globalStyle
    })
  },

  toLogin() {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  }
})