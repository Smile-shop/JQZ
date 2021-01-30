// pages/shop/index.js
const app = getApp();
Page({
  mixins: [require('../../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    navbarData: {
      goback: true,
      gohome: true,
      title: '积分记录',
      style: 2
    },
    globalStyle: app.globalData.globalStyle,
    safeArea: app.globalData.safeArea,
    score:'0',
    active: 0,
    show: false,
    allTab:[{title:"会员签到",time:"2020-10-20 10:20:20",score:"-1000"},
          {title:"开心小游戏消耗",time:"2020-10-20 10:20:20",score:"100"}],
    incomeTab:[{title:"会员签到",time:"2020-10-20 10:20:20",score:"1000"},
          {title:"开心小游戏消耗",time:"2020-10-20 10:20:20",score:"100"}],
    expendTab:[{title:"会员签到",time:"2020-10-20 10:20:20",score:"-1000"},
          {title:"开心小游戏消耗",time:"2020-10-20 10:20:20",score:"-100"}]
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
    wx.setNavigationBarTitle({
      title: '积分记录',
    })
    this.setTabBarStyleAndsetNavigationBarColor(false, 4) 
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