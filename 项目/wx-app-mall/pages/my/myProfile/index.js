// pages/shop/index.js
import log from '../../../utils/log'
const app = getApp();
import { getUserInfoLocal, queryUserInfoAndStore } from '../../../utils/userInfo'
import { getNavbarHeight } from '../../../utils/utils'
Page({
  mixins: [require('../../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    globalStyle: app.globalData.globalStyle,
    avatarUrl: '', // 用户头像
    nickname: '可爱的萝莉丸', // 昵称
    username: "赵云",
    shopassistant: "张飞",
    phone: "-",
    email: '1234@qq.com',
    fax: "0755-99999999",
    shop: "-",
    sex: "男",
    birthday: '',
    occupation: "",
    customer: "店小二",
    navbarHeight: 0, // 顶部高度
    navbarData: {
      goback: true,
      gohome: true,
      title: '个人资料',
      style: 2,
    }, // 顶部导航
  },

  // 获取用户信息
  async getUserInfo() {
    const  userInfoAndStore  = await queryUserInfoAndStore()
    const userInfo = await getUserInfoLocal()
    this.setData({
      avatarUrl: userInfo.userInfo.avatarUrl,
      nickname: userInfo.userInfo.nickName,
      shop: userInfoAndStore.store ? userInfoAndStore.store.name : '',
      phone: userInfoAndStore.member ? userInfoAndStore.member.phone : '',
    })
  },

  // 查询高度
  queryNavHeight() {
    const height = getNavbarHeight()
    this.setData({
      navbarHeight: height,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    // 查看是否授权
    log('查询用户信息', app.globalData.userInfoAndStore)
    this.getUserInfo()
    this.queryNavHeight()
    // wx.getSetting({
    //   success(res) {
    //     log('授权情况')
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           log('用户信息', res)
    //           _this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             nickName: res.userInfo.nickName,
    //             hasUserInfo: true
    //           })
    //         }
    //       })
    //     } else {
    //       _this.setData({
    //         hasUserInfo: false
    //       })
    //     }
    //   }
    // })
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
      title: '个人资料',
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