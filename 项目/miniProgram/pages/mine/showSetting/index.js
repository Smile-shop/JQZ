// pages/mine/index.js
import {
  Server
} from '../../../models/server.js'
const server = new Server();
const app = getApp();
var gs = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopName: '',
    price: '',
    shopNameAll: false,
    priceAll: false,
    globalStyle: getApp().globalData.globalStyle
  },
  // 查询客户信息
  customerInfo() {
    server.customerInfo().then((res) => {
      if (res.code === 0) {
        this.setData({
          shopName: res.replyData ? res.replyData.mallName : '',
          price: res.replyData ? res.replyData.ratio : ''
        })
      }
    })
  },
  // 获取商品名称
  shopNameFun(e) {
    this.setData({
      shopName: e.detail.value
    });
    // if (this.data.shopName !== '') {
    //   this.setData({
    //     shopNameAll: true
    //   });
    // } else {
    //   this.setData({
    //     shopNameAll: false
    //   });
    // }
  },  // 获取价格倍率
  priceFun(e) {
    if (e.detail.value === ''){
      this.setData({
        price: '',
        priceAll: false
      })
      return
    }
    const regex = /^(0\.([1-9]{1,4})|\d\.[0-9]{1,4}|[1-9]|10)$/;
    const result = regex.test(e.detail.value);
    if (!result) {
      wx.showToast({
        title: '价格倍率可填范围0.1-10',
        icon: 'none'
      })
      this.setData({
        price: '',
        priceAll: false
      });
    } else {
      this.setData({
        price: e.detail.value,
        priceAll: true
      });
    }
  },
  priceRatio(e) {
    if (e.detail.value === '') {
      this.setData({
        price: '',
        priceAll: false
      })
    } else {
      this.setData({
        price: e.detail.value,
        priceAll: true
      });
    }
  },
  // 保存
  saveMethod() {
    // 获取本地customerInfo
    let customerInfo = wx.getStorageSync('customerInfo'); 
    const params = {
      mallName: this.data.shopName,
      ratio: this.data.price
    }
    server.getEdit(params).then((res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        });
        customerInfo.ratio = parseFloat(this.data.price);
        customerInfo.mallName = this.data.shopName;
        wx.setStorageSync('customerInfo', customerInfo);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.customerInfo();
    this.setData({
      globalStyle: getApp().globalData.globalStyle
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
    // 设置头部导航栏背景色
    gs.globalStyleFun(app.globalData.globalStyle, this);
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