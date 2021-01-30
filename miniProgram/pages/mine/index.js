// pages/mine/index.js
import {
  Server
} from '../../models/server.js'
const server = new Server();
const app = getApp()
var gs = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    avatarUrl: '', // 用户头像
    nickName: '', // 昵称
    editShopmallName: 1 ,// 1启用 0 禁用
    maxTip: 9, // 可改变角标样式
    maxTipNum: 99, // 最大可实现的角标
    maxText: 99, // 最大字样
    maxUnit: '+', // 超出符号
    globalStyle: app.globalData.globalStyle,
    status: {
      all: 'all',
      waiting: 'waiting',
      confirm: 'confirm',
      increase: 'increase',
      cancel: 'cancel',
      finish: 'finish',
    },
    tag: {
      waiting: {
        status: '0',
        num: 0,
        tip: 0, 
        plus: false,
      },
      confirm: {
        status: '1',
        num: 0,
        tip: 0,
        plus: false,
      },
      increase: {
        status: '2',
        num: 0,
        tip: 0,
        plus: false,
      },
      cancel: {
        status: '-1',
        num: 0,
        tip: 0,
        plus: false,
      },
      finish: {
        status: '3',
        num: 0,
        tip: 0,
        plus: false,
      }
    },
  },

  goCollection: function() {
    wx.switchTab({
      url: '/pages/mine/myCollection/index',
    })
  },
  // 查询客户信息关于商城设置
  customerInfo() {
    server.customerInfo().then((res) => {
      if (res.code === 0) {
        this.setData({
          editShopmallName: res.replyData.pageSettingInfo ? res.replyData.pageSettingInfo.editShopmallName : 1,
        })
      }
    })
  },

  // 存储用户图像和昵称
  keepUserNameImg(params) {
    server.keepUserNameImg(params).then((res) => {
      if(res.code === 0) {
        console.log('存储用户图像和昵称')
      }
    })
  },

  // 查询用户图像和昵称
  queryUserNameImg(params) {
    server.queryUserNameImg(params).then((res) => {
      if (res.code === 0) {
        console.log('查询用户图像和昵称')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        console.log('授权情况')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('用户信息', res)
              _this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                hasUserInfo: true
              })
            }
          })
        } else {
          _this.setData({
            hasUserInfo: false
          })
        }
      }
    })
  },

  bindGetUserInfo(option) {
    this.setData({
      avatarUrl: option.detail.userInfo.avatarUrl,
      nickName: option.detail.userInfo.nickName,
      hasUserInfo: true
    })
  },

  // 匹配订单数据
  matchOrder(arr) {
    const arg = arr
    const tag = this.data.tag
    const mark = this.data.maxTipNum
    const maxText = this.data.maxText
    const maxTip = this.data.maxTip
    const list = Object.keys(tag)
    const result = {}
    arg.map(item => {
      list.map(ite => {
        if (tag[ite].status == item.orderStatus) {
          const options = {}
          options.tip = item.orderCount > maxTip ? true : false
          options.num = item.orderCount > mark ? maxText : item.orderCount
          options.status = tag[ite].status
          options.plus = item.orderCount > mark ? true : false
          let tagKey = ite
          result[tagKey] = options
        }
      })
    })
    this.setData({
      tag: result,
    })
  },

  // 查看全部
  handleOrder(e) {
    console.log('查看全部事件委托', e)
    const mark = e.currentTarget.id
    console.log(mark, '标识')
    const urlMark = this.data.status[mark]
    console.log(urlMark, '路径')
    wx.navigateTo({
      url: `/pages/order/index?mark=${urlMark}`,
    })
  },

  // 查询订单统一信息
  queryOrderCountInfo() {
    const customerInfo =  wx.getStorageSync('customerInfo')
    const customerId = customerInfo.customerId || null
    server.queryOrderCount(customerId).then(res => {
      const { data } = res
      console.log('获得订单统一信息', data)
      this.matchOrder(data)
    })
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 3,
        globalStyle: app.globalData.globalStyle
      })
    }
    this.customerInfo();
    // 设置头部导航栏背景色
    gs.globalStyleFun(app.globalData.globalStyle, this);
    this.queryOrderCountInfo()
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