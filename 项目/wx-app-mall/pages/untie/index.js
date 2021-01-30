// pages/untie/index.js
const app = getApp()
import { untieUser } from '../../api/my'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 删除用户信息
  async removeUserInfo() {
    try {
      wx.removeStorageSync('loginCode')
    } catch (e) {
      // Do something when catch error
    }
    try {
      wx.removeStorageSync('WxToken')
    } catch (e) {
      // Do something when catch error
    }
    try {
      wx.removeStorageSync('userInfo')
    } catch (e) {
      // Do something when catch error
    }
    try {
      wx.removeStorageSync('JqzToken')
    } catch (e) {
      // Do something when catch error
    }
    app.globalData.userInfoAndStore = null
  },

  async handleUntieUser() {
    console.log('解除绑定')
    const body = ""
    const res = await untieUser(body)
    this.removeUserInfo()

    const { code } = res
    console.log('解除绑定')
    if (code === 0) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})